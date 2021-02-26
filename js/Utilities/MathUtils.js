export const getCircumference = (radius) => 2 * Math.PI * radius
export const getCenterPointsOfSlider = (radius) => ({cx: radius, cy: radius})
export const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees * Math.PI) / 180
  const x = centerX + radius * Math.cos(angleInRadians)
  const y = centerY + radius * Math.sin(angleInRadians)
  return {x, y}
}
