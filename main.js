import CircularSlider from './js/Components/CircularSlider.js'
import SliderOptions from './js/Models/SliderOptions.js'
import * as InterfaceUtils from './js/Utilities/InterfaceUtils.js'
import * as StringConstants from './js/Constants/StringConstants.js'

// Constants
const MAX_RADIUS = InterfaceUtils.isMobileDevice() ? 100 : 300
const STEP_RADIUS = InterfaceUtils.isMobileDevice() ? 50 : 100
const mainContainer = document.getElementById('mainContainer')

// Global varaibles
let nrExistingSliders = 0

const isSpaceAvailable = () => {
  return InterfaceUtils.isSpaceAvailable(
    nrExistingSliders,
    MAX_RADIUS,
    STEP_RADIUS,
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
  new CircularSlider(sliderOptions)
}

function generateSliderOptions() {
  // Generate Slider Options based on User inputs
  const sliderName = prompt('Please enter your Slider Name', 'Food')
  const minimumValue = prompt('Please enter starting value for Slider', 0)
  const maximumValue = prompt('Please enter maximum value for Slider', 100)
  const stepValue = prompt('Please enter Step value for Slider', 10)

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
  .getElementById('btnCreateSlider')
  .addEventListener('click', createNewSlider)
document
  .getElementById('btnGenerateRandom')
  .addEventListener('click', generateRandomSliders)
