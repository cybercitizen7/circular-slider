import CircularSlider from './js/Components/CircularSlider.js'
import SliderOptions from './js/Models/SliderOptions.js'
import * as InterfaceUtils from './js/Utilities/InterfaceUtils.js'
import * as StringConstants from './js/Constants/StringConstants.js'

// Constants
const SVG_HEIGHT = InterfaceUtils.isMobileDevice() ? 400 : 600
const SVG_WIDTH = InterfaceUtils.isMobileDevice() ? 400 : 600
const MAX_RADIUS = InterfaceUtils.isMobileDevice() ? 160 : 240
const STEP_RADIUS = InterfaceUtils.isMobileDevice() ? 60 : 90

// Main Containerrs
const mainContainer = document.querySelector('.main')
const svgContainer = document.querySelector('.main__svg')
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
  btnCreateSlider.disabled = true
  btnGenerateRandom.disabled = true

  const sliderOptions = [
    new SliderOptions(
      mainContainer,
      '#ff62a7',
      1000,
      0,
      10,
      InterfaceUtils.isMobileDevice() ? 160 : 240,
      'Traveling',
      true,
    ),
    new SliderOptions(
      mainContainer,
      '#ffff01',
      100,
      10,
      20,
      InterfaceUtils.isMobileDevice() ? 100 : 150,
      'Electricity',
      false,
    ),
    new SliderOptions(
      mainContainer,
      '#008fff',
      500,
      0,
      100,
      InterfaceUtils.isMobileDevice() ? 40 : 60,
      'Entertainment',
      false,
    ),
  ]

  sliderOptions.forEach((sliderOption) =>
    new CircularSlider(sliderOption).drawSlider(svgContainer),
  )
}

const createNewSlider = () => {
  btnGenerateRandom.disabled = true

  const sliderOptions = generateSliderOptions()

  new CircularSlider(sliderOptions).drawSlider(svgContainer)
  nrExistingSliders++
  if (!isSpaceAvailable()) btnCreateSlider.disabled = true
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
const btnCreateSlider = document.querySelector('.btn--custom')
btnCreateSlider.addEventListener('click', createNewSlider)
const btnGenerateRandom = document.querySelector('.btn--random')
btnGenerateRandom.addEventListener('click', generateRandomSliders)
