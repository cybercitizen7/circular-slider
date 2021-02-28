export function getRandomColorForSlider() {
  const COLORS = {
    CELTRA_BLUE: 0, // #008fff
    CELTRA_GREEN: 1, // #0dff73
    CELTRA_YELLOW: 2, // #ffff07
    CELTRA_PINK: 3, // #ff62a7
  }
  // Generate random number between 0 and 3
  let randomNumber = Math.floor(Math.random() * 4)

  switch (randomNumber) {
    case COLORS.CELTRA_BLUE:
      return '#008fff'
    case COLORS.CELTRA_GREEN:
      return '#0dff73'
    case COLORS.CELTRA_YELLOW:
      return '#ffff07'
    case COLORS.CELTRA_PINK:
      return '#ff62a7'
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
