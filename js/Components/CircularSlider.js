import * as MathUtils from '../Utilities/MathUtils.js'
import * as SvgUtils from '../Utilities/SvgUtils.js'

export default class CircularSlider {
  constructor(options) {
    console.log('Circular Slider Constructor')
    console.log(options)
    this.sliderContainer = options.container
    this.maxSliderValue = parseInt(options.maxValue)
    this.minSliderValue = parseInt(options.minValue)
    this.radius = parseInt(options.radius)
    this.step = parseInt(options.step)
    this.sliderColor = options.color
    this.sliderName = options.name

    this.mouseDown = false
    this.activeSlider = null
    this.centerPoint = MathUtils.getCenterPointsOfSlider(this.radius)
    this.sliderValue = this.minSliderValue
    this.sliderId = 'slider-' + this.radius

    this.createLegend()
    this.createNewSlider()
  }

  createNewSlider() {}

  drawSlider() {}

  createLegend() {
    const expenseContainer = document.createElement('div')
    expenseContainer.classList.add('expense-container')

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
    expenseValue.innerHTML = this.sliderValue + 'EUR'

    expenseContainer.appendChild(expenseName)
    expenseContainer.appendChild(expenseBox)
    expenseContainer.appendChild(expenseValue)

    document.getElementById('legend-container').appendChild(expenseContainer)
  }
}
