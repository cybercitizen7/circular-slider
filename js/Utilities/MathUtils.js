export const getCircumference = (radius) => 2 * Math.PI * radius
export const getPointOnCircumference = (cx, cy, angle, radius) => {
  // https://www.mathopenref.com/coordparamcircle.html
  // Parametric Equation of a Circle
  const x = cx + Math.cos(angle) * radius
  const y = cy + Math.sin(angle) * radius
  return {x, y}
}

export const degreeToRadian = (angleDegrees) => {
  return angleDegrees * (Math.PI / 180)
}

export const radianToDegrees = (angleRadians) => {
  return angleRadians / (Math.PI / 180)
}

export const getAngleOnCircleBetweenPointAndY = (newPoint, cx, cy) => {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2
  // atan2 returns the angle between positive x-axis and the ray from centerPoint to newPoint
  const deltaX = newPoint.x - cx
  const deltaY = newPoint.y - cy

  // In order to calculate the angle between the Y-axis and the Point, we need to inverse the deltaX and deltaY
  // additionally, since our system works ClockWise, we have to change the sign of Y to negative (axis direction down)
  const angleRad = Math.atan2(deltaX, -deltaY)

  // Once the angle moves from positive X-axis towards negative
  // our atan2 function returns the negative value, since it now calcultes from negative X-axis
  // we adjust this, by adding 2 * Math.PI to our angleRad
  const radian360 = angleRad < 0 ? angleRad + 2 * Math.PI : angleRad
  return radian360
}
