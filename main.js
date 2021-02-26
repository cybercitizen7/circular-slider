import CircularSlider from './js/Components/CircularSlider.js'

const generateRandomSliders = () => {
  console.log('Generate Random Sliders clicked.')
}

const createNewSlider = () => {
  new CircularSlider({}, {})
}

// Attach Button Event Listeners
document
  .getElementById('btnCreateSlider')
  .addEventListener('click', createNewSlider)
document
  .getElementById('btnGenerateRandom')
  .addEventListener('click', generateRandomSliders)
