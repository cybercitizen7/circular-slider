import KnobModel from '../Models/KnobModel.js'

import * as MathUtils from '../Utilities/MathUtils.js'
import * as SvgUtils from '../Utilities/SvgUtils.js'

export default class CircularSlider {
  constructor(options) {
    console.log('Circular Slider Constructor')
    console.log(options)
    this.sliderContainer = options.container
    this.sliderSvgWidth = 400
    this.sliderSvgHeight = 400
    this.maxSliderValue = parseInt(options.maxValue)
    this.minSliderValue = parseInt(options.minValue)
    this.radius = parseInt(options.radius)
    this.step = parseInt(options.step)
    this.sliderColor = options.color
    this.sliderName = options.name

    this.cx = this.sliderSvgWidth / 2
    this.cy = this.sliderSvgHeight / 2
    this.sliderValue = this.minSliderValue
    this.sliderId = 'slider-' + this.radius

    this.emptySliderColor = '#888888'
    this.sliderStrokeWidth = 25

    this.mouseDown = false
    this.mouseMove = false
    this.activeSliderGroup = null

    this.createLegend()
  }

  drawSlider(svg) {
    const sliderGroup = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'g',
    )
    sliderGroup.id = 'slider-group-' + this.radius
    sliderGroup.setAttribute(
      'transform',
      'rotate(-90,' + this.cx + ',' + this.cy + ')',
    )
    sliderGroup.setAttribute('rad', this.radius)
    sliderGroup.setAttribute('maxSliderValue', this.maxSliderValue)
    sliderGroup.setAttribute('minSliderValue', this.minSliderValue)
    sliderGroup.setAttribute('sliderStep', this.step)
    svg.appendChild(sliderGroup)

    // First Draw Empty Slider
    this.drawArcPath(this.emptySliderColor, 360, 'inactive', sliderGroup)
    // Then we draw the Active slider
    this.drawArcPath(this.sliderColor, 0, 'active', sliderGroup)
    // Finally we have to draw the Knob
    this.drawKnob(sliderGroup, 0)

    // Attach Event Handlers
    this.attachEventListeners(this.sliderContainer)
  }

  drawKnob(svgGroup, angle) {
    const knobCenter = MathUtils.getPointOnCircumference(
      this.cx,
      this.cy,
      MathUtils.degreeToRadian(angle),
      this.radius,
    )

    const knob = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle',
    )
    knob.id = 'knob-' + this.radius
    knob.setAttribute('cx', knobCenter.x)
    knob.setAttribute('cy', knobCenter.y)
    knob.setAttribute('r', this.sliderStrokeWidth / 2)
    knob.style.stroke = KnobModel.strokeColor
    knob.style.strokeWidth = KnobModel.strokeWidth
    knob.style.fill = KnobModel.fillColor
    svgGroup.appendChild(knob)
  }

  createLegend() {
    console.log('Creating Legend')
    const expenseContainer = document.createElement('div')
    expenseContainer.classList.add('expense-container')
    expenseContainer.id = 'expense-container-' + this.radius

    const expenseName = document.createElement('p')
    expenseName.classList.add('medium-text')
    expenseName.id = 'expense-name'
    expenseName.innerHTML = this.sliderName

    const expenseBox = document.createElement('div')
    expenseBox.style.backgroundColor = this.sliderColor
    expenseBox.classList.add('expense-box')

    const expenseValue = document.createElement('p')
    expenseValue.classList.add('medium-text')
    expenseValue.id = 'expense-value'
    expenseValue.innerHTML = this.sliderValue + ' EUR'

    expenseContainer.appendChild(expenseName)
    expenseContainer.appendChild(expenseBox)
    expenseContainer.appendChild(expenseValue)

    document.getElementById('legend-container').appendChild(expenseContainer)
  }

  updateUI(newPoint) {
    // Do not search for new Slider if we are performing 'mouseMove'
    if (!this.mouseMove)
      this.activeSliderGroup = this.findClosestSlider(newPoint)
    const activeSliderRadius = +this.activeSliderGroup.getAttribute('rad')
    const currentAngle =
      MathUtils.getAngleOnCircleBetweenPointAndY(newPoint, this.cx, this.cy) *
      0.999

    // update Slider
    this.updateSlider(activeSliderRadius, currentAngle)

    // update Knob
    this.updateKnob(activeSliderRadius, currentAngle)

    // update Legend
    this.updateLegend(activeSliderRadius, currentAngle)
  }

  updateSlider(activeSliderRadius, currentAngle) {
    const activePath = this.activeSliderGroup.querySelector('#active')
    const arcPath = this.generateArcPath(
      this.cx,
      this.cy,
      activeSliderRadius,
      MathUtils.radianToDegrees(currentAngle),
    )

    activePath.setAttribute(
      'd',
      `M ${arcPath.M.mx} ${arcPath.M.my} A ${arcPath.A.rx} ${arcPath.A.ry} ${arcPath.A.xRotation} ${arcPath.A.arcSweep} ${arcPath.A.largeArc} ${arcPath.A.endX} ${arcPath.A.endY} ${arcPath.Z}`,
    )
  }

  updateKnob(activeSliderRadius, currentAngle) {
    const knobId = '#knob-' + activeSliderRadius
    const knob = this.activeSliderGroup.querySelector(knobId)
    const knobCenter = MathUtils.getPointOnCircumference(
      this.cx,
      this.cy,
      currentAngle,
      activeSliderRadius,
    )
    knob.setAttribute('cx', knobCenter.x)
    knob.setAttribute('cy', knobCenter.y)
  }

  updateLegend(activeSliderRadius, currentAngle) {
    const expenseContainer = document.querySelector(
      '#expense-container-' + activeSliderRadius,
    )

    // Get the Active slider's expenseValue element from the Container
    const expenseValue = Array.from(expenseContainer.children).filter(
      (element) => {
        return element.id === 'expense-value'
      },
    )[0]

    // Get the Max/Min/Step values from Active Slider's Attributes
    const maxSliderValue = parseInt(
      this.activeSliderGroup.getAttribute('maxSliderValue'),
    )
    const minSliderValue = parseInt(
      this.activeSliderGroup.getAttribute('minSliderValue'),
    )
    const sliderStep = parseInt(
      this.activeSliderGroup.getAttribute('sliderStep'),
    )

    const currentSliderRange = maxSliderValue - minSliderValue
    let currentValue = (currentAngle / (2 * Math.PI)) * currentSliderRange
    const numOfSteps = Math.round(currentValue / sliderStep)
    currentValue = minSliderValue + numOfSteps * sliderStep
    expenseValue.innerHTML = currentValue + ' EUR'
  }

  attachEventListeners(sliderContainer) {
    sliderContainer.addEventListener(
      'mousedown',
      this.mouseTouchStart.bind(this),
      false,
    )
    sliderContainer.addEventListener(
      'touchstart',
      this.mouseTouchStart.bind(this),
      false,
    )
    sliderContainer.addEventListener(
      'mousemove',
      this.mouseTouchMove.bind(this),
      false,
    )
    sliderContainer.addEventListener(
      'touchmove',
      this.mouseTouchMove.bind(this),
      false,
    )
    window.addEventListener('mouseup', this.mouseTouchEnd.bind(this), false)
    window.addEventListener('touchend', this.mouseTouchEnd.bind(this), false)
  }

  drawArcPath(sliderColor, currentAngle, type, sliderGroup) {
    const pathId = type === 'active' ? 'active' : 'inactive'
    const arcPath = this.generateArcPath(
      this.cx,
      this.cy,
      this.radius,
      currentAngle,
    )

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.id = pathId
    path.setAttribute(
      'd',
      `M ${arcPath.M.mx} ${arcPath.M.my} A ${arcPath.A.rx} ${arcPath.A.ry} ${arcPath.A.xRotation} ${arcPath.A.arcSweep} ${arcPath.A.largeArc} ${arcPath.A.endX} ${arcPath.A.endY} ${arcPath.Z}`,
    )
    path.style.stroke = sliderColor
    path.style.strokeWidth = 25
    path.style.fill = 'none'

    sliderGroup.appendChild(path)
  }

  generateArcPath(x, y, radius, angle) {
    // https://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
    // Parameters for Arc Path:
    //  A rx ry x-axis-rotation large-arc-flag sweep-flag x y
    // in our case with circles, rx and ry are basically the radius of the circle,
    // as we do not work with elipses

    let moveToX = 0
    let moveToY = 0
    let arcSweep = 0
    let arcEndX = 0
    let arcEndY = 0
    let z = false

    //  x=cx+rx*cos(theta) and y=cy+ry*sin(theta)
    // Move to coordinates
    if (angle === 360) {
      angle = 359
      // z-attribute descrives Close Path, which is used when we complete a full circle / path
      z = true
    }

    moveToX = x + radius * Math.cos(MathUtils.degreeToRadian(angle))
    moveToY = y + radius * Math.sin(MathUtils.degreeToRadian(angle))

    // We are always drawing our arc from the 0 degree angle
    //  x=cx+rx*cos(theta) and y=cy+ry*sin(theta)
    // We could write: arcEndX = x + radius * Math.cos(0)  and arcEndY = y + radius * Math.sin(0),
    // but for our project, there is no need to perform these additional Math computing, so I shortened it
    // cos(0) = 1, sin(0) = 0
    arcEndX = x + radius
    arcEndY = y

    // Arc Sweep determines the positivity of the angle direction (1 is position direction: from start point to end point)
    arcSweep = angle <= 180 ? '0' : '1'

    let path = {
      M: {
        mx: moveToX,
        my: moveToY,
      },
      A: {
        rx: radius,
        ry: radius,
        xRotation: 0,
        largeArc: 0,
        arcSweep: arcSweep,
        endX: arcEndX,
        endY: arcEndY,
      },
      Z: z ? 'z' : '',
    }

    return path
  }

  mouseTouchStart(e) {
    if (this.mouseDown) return
    this.mouseDown = true
    const newPoint = this.getRelativeMouseOrTouchCoordinates(e)

    this.updateUI(newPoint)
  }

  mouseTouchMove(e) {
    if (!this.mouseDown) return
    this.mouseMove = true
    e.preventDefault()
    const newPoint = this.getRelativeMouseOrTouchCoordinates(e)

    this.updateUI(newPoint)
  }

  mouseTouchEnd() {
    if (!this.mouseDown) return
    this.mouseDown = false
    this.mouseMove = false
    this.activeSliderGroup = null
  }

  getRelativeMouseOrTouchCoordinates(e) {
    const containerRect = document
      .querySelector('#svg-container')
      .getBoundingClientRect()
    let x, y, clientPosX, clientPosY

    // Touch Event triggered
    if (e instanceof TouchEvent) {
      clientPosX = e.touches[0].pageX
      clientPosY = e.touches[0].pageY
    }
    // Mouse Event Triggered
    else {
      clientPosX = e.clientX
      clientPosY = e.clientY
    }

    // Get Relative Position
    x = clientPosX - containerRect.left
    y = clientPosY - containerRect.top

    return {x, y}
  }

  findClosestSlider(newPoint) {
    // Get the Hypotenuse of the right triangle that is always formed
    // from the CenterPoint of Slider towards the NewPoint
    // this is basically the distance of the newPoint from the sliderCenter
    const newPointDistanceFromCenter = Math.hypot(
      newPoint.x - this.cx,
      newPoint.y - this.cy,
    )
    const container = document.querySelector('#svg-container')
    // Get all the sliders that we currently have on Canvas
    const sliderGroups = Array.from(container.querySelectorAll('g'))

    // Get distances from newPoint to each slider
    const distances = sliderGroups.map((slider) => {
      const radius = parseInt(slider.getAttribute('rad'))
      // Get the absolute value of the distance between newPoint and current Slider
      // newPointDistanceFromCenter - slider Radius gives us this distance
      return Math.abs(newPointDistanceFromCenter - radius)
    })

    // Find the Index of the distance that is closest to the Slider
    // the closest slider is the one that has the lowest distance between
    // newPoint and slider
    const closestSliderIndex = distances.indexOf(Math.min(...distances))
    return sliderGroups[closestSliderIndex]
  }
}
