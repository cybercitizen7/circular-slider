export function createSvgNode(svgType, attributes) {
  svgType = document.createElementNS('http://www.w3.org/2000/svg', svgType)
  for (var p in attributes) {
    // Need to make exception for viewBox, since it is not written with dash
    if (p === 'viewBox') {
      svgType.setAttributeNS(null, 'viewBox', attributes[p])
    } else {
      svgType.setAttributeNS(
        null,
        p.replace(/[A-Z]/g, function (m, p, o, s) {
          return '-' + m.toLowerCase()
        }),
        attributes[p],
      )
    }
  }
  return svgType
}
