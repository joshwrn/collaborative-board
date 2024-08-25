interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}

export const doRectanglesOverlap = (rect1: Rectangle, rect2: Rectangle) => {
  if (rect1.x + rect1.width <= rect2.x || rect2.x + rect2.width <= rect1.x) {
    return false
  }
  if (rect1.y + rect1.height <= rect2.y || rect2.y + rect2.height <= rect1.y) {
    return false
  }
  return true
}
