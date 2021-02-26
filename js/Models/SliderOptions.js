import * as StringConstants from '../Constants/StringConstants.js'

export default class SliderOptions {
  constructor(_container, _color, _maxValue, _minValue, _step, _radius) {
    this.container = _container
    this.color = _color
    this.maxValue = _maxValue
    this.minValue = _minValue
    this.step = _step
    this.radius = _radius
  }

  validateOptions() {
    if (isNaN(parseInt(this.maxValue)))
      return {
        error: true,
        message: `${StringConstants.INVALID_MAXIMUM_VALUE_NAN} MaxValue: ${this.maxValue}`,
      }

    if (isNaN(parseInt(this.minValue)))
      return {
        error: true,
        message: `${StringConstants.INVALID_MINIMUM_VALUE_NAN} MinValue: ${this.minValue}`,
      }

    if (isNaN(parseInt(this.step)))
      return {
        error: true,
        message: `${StringConstants.INVALID_STEP_VALUE_NAN} StepValue: ${this.step}`,
      }

    if (this.maxValue <= this.minValue)
      return {
        error: true,
        message: `${StringConstants.MIN_BIGGER_OR_EQUAL_TO_MAX}
          MinValue: ${this.minValue} vs MaxValue ${this.maxValue}`,
      }
    if (this.step <= 0)
      return {
        error: true,
        message: `${StringConstants.INVALID_STEP_VALUE_ZERO} StepValue: ${this.step}`,
      }
    if (this.step >= this.maxValue)
      return {
        error: true,
        message: `${StringConstants.STEP_VALUE_BIGGER_OR_EQUAL_TO_MAX} StepValue: ${this.step} vs. MaxValue: ${this.maxValue}`,
      }

    return {error: false, message: 'All Good'}
  }
}
