import type { Point2d } from '@/state'

export const findCenterpoint = (point1: Point2d, point2: Point2d): Point2d => {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2,
  }
}
