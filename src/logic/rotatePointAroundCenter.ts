import { Point2d } from '@/state'
import { rotatePoint } from './rotatePoint'

export const rotatePointAroundCenter = (
  point: Point2d,
  center: Point2d,
  angle: number,
): Point2d => {
  const { x, y } = point
  const { x: cx, y: cy } = center
  // Translate point to the origin
  let translatedX = x - cx
  let translatedY = y - cy

  // Rotate the point
  let rotatedPoint = rotatePoint(
    {
      x: translatedX,
      y: translatedY,
    },
    angle,
  )

  // Translate point back
  let xNew = rotatedPoint.x + cx
  let yNew = rotatedPoint.y + cy

  return { x: xNew, y: yNew }
}
