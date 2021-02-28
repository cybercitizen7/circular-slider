import CircularSlider from './js/Components/CircularSlider.js'
import SliderOptions from './js/Models/SliderOptions.js'
import * as InterfaceUtils from './js/Utilities/InterfaceUtils.js'
import * as StringConstants from './js/Constants/StringConstants.js'
import * as SvgUtils from './js/Utilities/SvgUtils.js'

// Constants
const SVG_HEIGHT = InterfaceUtils.isMobileDevice() ? 400 : 400
const SVG_WIDTH = InterfaceUtils.isMobileDevice() ? 400 : 400
const MAX_RADIUS = InterfaceUtils.isMobileDevice() ? 160 : 160
const STEP_RADIUS = InterfaceUtils.isMobileDevice() ? 60 : 60

// Main Containerrs
const mainContainer = document.getElementById('main-container')
const svgContainer = document.getElementById('svg-container')
svgContainer.style.width = SVG_WIDTH
svgContainer.style.height = SVG_HEIGHT

// Global varaibles
let nrExistingSliders = 0

const isSpaceAvailable = () => {
  return InterfaceUtils.isSpaceAvailable(
    nrExistingSliders,
    STEP_RADIUS,
    MAX_RADIUS,
  )
}

const generateRandomSliders = () => {
  console.log('Generate Random Sliders clicked.')
}

const createNewSlider = () => {
  if (!isSpaceAvailable()) {
    alert(StringConstants.NO_MORE_SPACE_FOR_SLIDERS)
    return
  }

  const sliderOptions = generateSliderOptions()

  new CircularSlider(sliderOptions).drawSlider(svgContainer)
  nrExistingSliders++
}

function generateSliderOptions() {
  // Generate Slider Options based on User inputs
  const sliderName = prompt('Please enter your Slider Name', 'Food')
  const minimumValue = prompt('Please enter starting value for Slider', 0)
  const maximumValue = prompt('Please enter maximum value for Slider', 100)
  const stepValue = prompt('Please enter Step value for Slider', 10)
  let smoothScroll = prompt('Do you want to use smooth scrolling? [Y/n]', 'Y')
  if (smoothScroll === 'Y') smoothScroll = true
  else smoothScroll = false

  const radius = InterfaceUtils.getSliderRadius(
    nrExistingSliders,
    MAX_RADIUS,
    STEP_RADIUS,
  )

  const sliderColor = InterfaceUtils.getRandomColorForSlider()

  const sliderOptions = new SliderOptions(
    mainContainer,
    sliderColor,
    maximumValue,
    minimumValue,
    stepValue,
    radius,
    sliderName,
    smoothScroll,
  )

  // Validate Slider Options
  const validateSliderOptions = sliderOptions.validateOptions()
  // If there are any errors during validations, abort and return the error message
  if (validateSliderOptions['error']) {
    alert(validateSliderOptions['message'])
    return
  }

  return sliderOptions
}

// Attach Button Event Listeners
document
  .getElementById('btn-create-slider')
  .addEventListener('click', createNewSlider)
document
  .getElementById('btn-generate-random')
  .addEventListener('click', generateRandomSliders)
