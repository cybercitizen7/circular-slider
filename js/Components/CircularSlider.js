import * as MathUtils from '../Utilities/MathUtils.js'

export default class CircularSlider {
  constructor(options) {
    this.sliderContainer = options.container
    this.sliderSvgWidth = options.container.children[0].clientWidth // Slider SVG is the parent of all 'G'rouped SVG's, so its dimensions are important for centerPoint
    this.sliderSvgHeight = options.container.children[0].clientHeight
    this.maxSliderValue = parseInt(options.maxValue)
    this.minSliderValue = parseInt(options.minValue)
    this.radius = parseInt(options.radius)
    this.step = parseInt(options.step)
    this.stepAngle = parseInt(360 / (this.maxSliderValue / this.step))
    this.sliderColor = options.color
    this.sliderName = options.name
    this.smoothScroll = options.smoothScroll

    this.cx = this.sliderSvgWidth / 2
    this.cy = this.sliderSvgHeight / 2
    this.sliderValue = this.minSliderValue
    this.sliderId = 'slider-' + this.radius

    this.emptySliderColor = '#efefef'
    this.sliderStrokeWidth = 25
    this.snapTreshold = 0.1

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
    sliderGroup.setAttribute('data-radius', this.radius)
    sliderGroup.setAttribute('data-maxSliderValue', this.maxSliderValue)
    sliderGroup.setAttribute('data-minSliderValue', this.minSliderValue)
    sliderGroup.setAttribute('data-sliderStep', this.step)
    sliderGroup.setAttribute('data-smoothScroll', this.smoothScroll)
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
    knob.classList.add('knob')
    svgGroup.appendChild(knob)
  }

  createLegend() {
    const expenseContainer = document.createElement('div')
    expenseContainer.classList.add('expense-grid')
    expenseContainer.id = 'expense-container-' + this.radius

    const expenseName = document.createElement('p')
    expenseName.classList.add('expense-grid__item-name')
    expenseName.classList.add('expense-grid__item-name--medium-text')
    expenseName.id = 'expense-name'
    expenseName.innerHTML = this.sliderName

    const expenseBox = document.createElement('div')
    expenseBox.style.backgroundColor = this.sliderColor
    expenseBox.classList.add('expense-grid__item-box')

    const expenseValue = document.createElement('p')
    expenseValue.classList.add('expense-grid__item-value')
    expenseValue.classList.add('expense-grid__item-value--medium-text')
    expenseValue.id = 'expense-value'
    expenseValue.innerHTML = this.sliderValue + ' EUR'

    expenseContainer.appendChild(expenseName)
    expenseContainer.appendChild(expenseBox)
    expenseContainer.appendChild(expenseValue)

    document.querySelector('.legend__text').style.display = 'block'

    document.querySelector('.legend').appendChild(expenseContainer)
  }

  updateUI(newPoint) {
    // Do not search for new Slider if we are performing 'mouseMove'
    if (!this.mouseMove)
      this.activeSliderGroup = this.findClosestSlider(newPoint)

    this.smoothScroll =
      this.activeSliderGroup.getAttribute('data-smoothScroll') === 'true'
    const activeSliderRadius = +this.activeSliderGroup.getAttribute(
      'data-radius',
    )
    const currentAngleRadian =
      MathUtils.getAngleOnCircleBetweenPointAndY(newPoint, this.cx, this.cy) *
      0.999

    // update Slider
    this.updateSlider(activeSliderRadius, currentAngleRadian)

    // update Knob
    this.updateKnob(activeSliderRadius, currentAngleRadian)

    // update Legend
    this.updateLegend(activeSliderRadius, currentAngleRadian)
  }

  updateSlider(activeSliderRadius, currentAngleRadian) {
    const activePath = this.activeSliderGroup.querySelector('#active')
    const arcPath = this.generateArcPath(
      this.cx,
      this.cy,
      activeSliderRadius,
      MathUtils.radianToDegrees(currentAngleRadian),
    )

    activePath.setAttribute(
      'd',
      `M ${arcPath.M.mx} ${arcPath.M.my} A ${arcPath.A.rx} ${arcPath.A.ry} ${arcPath.A.xRotation} ${arcPath.A.arcSweep} ${arcPath.A.largeArc} ${arcPath.A.endX} ${arcPath.A.endY} ${arcPath.Z}`,
    )
  }

  updateKnob(activeSliderRadius, currentAngleRadian) {
    const knobId = '#knob-' + activeSliderRadius
    const knob = this.activeSliderGroup.querySelector(knobId)

    if (!this.smoothScroll) {
      const currentAngleDeg = MathUtils.radianToDegrees(currentAngleRadian)

      const nextAngleDeg = MathUtils.getSnappyAngleInDegrees(
        currentAngleDeg,
        this.stepAngle,
      )

      if (this.shouldSkip(nextAngleDeg, currentAngleDeg)) {
        currentAngleRadian = MathUtils.degreeToRadian(nextAngleDeg)
      }
    }

    const knobCenter = MathUtils.getPointOnCircumference(
      this.cx,
      this.cy,
      currentAngleRadian,
      activeSliderRadius,
    )
    knob.setAttribute('cx', knobCenter.x)
    knob.setAttribute('cy', knobCenter.y)
  }

  updateLegend(activeSliderRadius, currentAngleRadian) {
    const expenseContainer = document.querySelector(
      '#expense-container-' + activeSliderRadius,
    )

    // Get the Active slider's expenseValue element from the Container
    const expenseValue = expenseContainer.querySelector(
      '.expense-grid__item-value',
    )

    // Get the Max/Min/Step values from Active Slider's Attributes
    const maxSliderValue = parseInt(
      this.activeSliderGroup.getAttribute('data-maxSliderValue'),
    )
    const minSliderValue = parseInt(
      this.activeSliderGroup.getAttribute('data-minSliderValue'),
    )
    const sliderStep = parseInt(
      this.activeSliderGroup.getAttribute('data-sliderStep'),
    )

    const currentSliderRange = maxSliderValue - minSliderValue

    let currentAngleDeg = MathUtils.radianToDegrees(currentAngleRadian)

    if (!this.smoothScroll) {
      const nextAngleDeg = MathUtils.getSnappyAngleInDegrees(
        currentAngleDeg,
        this.stepAngle,
      )

      if (this.shouldSkip(nextAngleDeg, currentAngleDeg)) {
        currentAngleDeg = nextAngleDeg
      }
    }

    let currentValue = (currentAngleDeg / 360) * currentSliderRange
    const numOfSteps = Math.round(currentValue / sliderStep)
    currentValue = minSliderValue + numOfSteps * sliderStep

    if (currentValue >= maxSliderValue) currentValue = maxSliderValue

    expenseValue.textContent = currentValue + ' EUR'
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

  drawArcPath(sliderColor, currentAngleDeg, type, sliderGroup) {
    const pathId = type === 'active' ? 'active' : 'inactive'
    const arcPath = this.generateArcPath(
      this.cx,
      this.cy,
      this.radius,
      currentAngleDeg,
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
    path.setAttribute('stroke-dasharray', 10 + ' ' + 2)

    sliderGroup.appendChild(path)
  }

  generateArcPath(x, y, radius, angleDeg) {
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
    let z = angleDeg === 360

    if (!this.smoothScroll) {
      const nextAngleDeg = MathUtils.getSnappyAngleInDegrees(
        angleDeg,
        this.stepAngle,
      )

      if (this.shouldSkip(nextAngleDeg, angleDeg)) {
        angleDeg = nextAngleDeg
      }
    }

    // if angleDef is 360 (or higher due Snappiness calculation)
    // we need to adjust it to 359, so we don't just jump over the last angles
    angleDeg = angleDeg >= 360 ? 359 : angleDeg

    // Move to coordinates
    //  x=cx+rx*cos(theta) and y=cy+ry*sin(theta)
    moveToX = x + radius * Math.cos(MathUtils.degreeToRadian(angleDeg))
    moveToY = y + radius * Math.sin(MathUtils.degreeToRadian(angleDeg))

    // We are always drawing our arc from the 0 degree angle
    //  x=cx+rx*cos(theta) and y=cy+ry*sin(theta)
    // We could write: arcEndX = x + radius * Math.cos(0)  and arcEndY = y + radius * Math.sin(0),
    // but for our project, there is no need to perform these additional Math computing, so I shortened it
    // cos(0) = 1, sin(0) = 0
    arcEndX = x + radius
    arcEndY = y

    // Arc Sweep determines the positivity of the angle direction (1 is position direction: from start point to end point)
    arcSweep = angleDeg <= 180 ? '0' : '1'

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
      .querySelector('.main__svg')
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
    const container = document.querySelector('.main__svg')
    // Get all the sliders that we currently have on Canvas
    const sliderGroups = Array.from(container.querySelectorAll('g'))

    // Get distances from newPoint to each slider
    const distances = sliderGroups.map((slider) => {
      const radius = parseInt(slider.getAttribute('data-radius'))
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

  shouldSkip(nextAngleDeg, currentAngleDeg) {
    const currentSteps = MathUtils.getCurrentStep(
      currentAngleDeg,
      this.stepAngle,
    )
    const prevStepAngle = MathUtils.getCurrentStepAngleDeg(
      currentSteps - 1,
      this.stepAngle,
    )
    // Skip only when the currentAngle reaches the Treshold value for snapping
    return currentAngleDeg >= nextAngleDeg * this.snapTreshold + prevStepAngle
  }
}
