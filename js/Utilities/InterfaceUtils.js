export function getRandomColorForSlider() {
  const COLORS = {
    BLUE: 0, // #0000cc
    GREEN: 1, // #33cc33
    ORANGE: 2, // #ff9900'
    RED: 3, // #ff0000
  }
  // Generate random number between 0 and 3
  let randomNumber = Math.floor(Math.random() * 4)

  switch (randomNumber) {
    case COLORS.BLUE:
      return '#2196f3'
    case COLORS.GREEN:
      return '#4caf50'
    case COLORS.ORANGE:
      return '#ffa726'
    case COLORS.RED:
      return '#ff5722'
    default:
      console.log(
        'Must have been some error if we come here, but we anyway set some default color.',
      )
      return '#2196f3'
  }
}

export function getSliderRadius(nrExistingSliders, maxRadius, stepRadius) {
  return nrExistingSliders > 0
    ? maxRadius - nrExistingSliders * stepRadius
    : maxRadius
}

export function isSpaceAvailable(nrExistingSliders, stepRadius, maxRadius) {
  return nrExistingSliders * stepRadius < maxRadius
}

export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  )
}
