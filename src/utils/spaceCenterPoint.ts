import { Point2d } from '@/state'
import { SPACE_ATTRS } from '@/state/space'

export const spaceCenterPoint = (zoom: number, pan: Point2d) => {
  const left = SPACE_ATTRS.size.default / 2 - pan.x
  const top = SPACE_ATTRS.size.default / 2 - pan.y
  const x = left / zoom
  const y = top / zoom
  return {
    x: x,
    y: y,
  }
}
