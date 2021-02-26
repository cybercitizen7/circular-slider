const generateRandomSliders = () => {
  console.log('Generate Random Sliders clicked.')
}

const createNewSlider = () => {
  console.log('Create new Slider Clicked')
}

// Attach Button Event Listeners
document
  .getElementById('btnCreateSlider')
  .addEventListener('click', createNewSlider)
document
  .getElementById('btnGenerateRandom')
  .addEventListener('click', generateRandomSliders)
