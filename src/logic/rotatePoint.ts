import { Point2d } from '@/state'

export const rotatePoint = (point: Point2d, angle: number): Point2d => {
  const { x, y } = point
  let radians = angle * (Math.PI / 180)

  let xNew = x * Math.cos(radians) - y * Math.sin(radians)
  let yNew = x * Math.sin(radians) + y * Math.cos(radians)

  return { x: xNew, y: yNew }
}
