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
      return '#0000cc'
    case COLORS.GREEN:
      return '#33cc33'
    case COLORS.ORANGE:
      return '#ff9900'
    case COLORS.RED:
      return '#ff0000'
    default:
      console.log(
        'Must have been some error if we come here, but we anyway set some default color.',
      )
      return '#cc00cc'
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
