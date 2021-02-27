export const getCircumference = (radius) => 2 * Math.PI * radius
export const getKnobCenter = (cx, cy, angle, radius) => {
  const x = cx + Math.cos(angle) * radius
  const y = cy + Math.sin(angle) * radius
  return {x, y}
}

export const degreeToRadian = (angleDegrees) => {
  return angleDegrees * ((2 * Math.PI) / 360)
}
