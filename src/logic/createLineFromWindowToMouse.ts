import { Point2d } from '@/state'
import { SIDES } from '@/state/connections'
import { Window } from '@/state/windows'
import { distance } from 'mathjs'
import {
  calculateConnectionPoints,
  circle,
  closestLineBetweenCircles,
  createCircleMargins,
  createDimensions,
} from './createLineBetweenWindowSides'

export const createLineFromWindowToMouse = (
  windowFrom: Window,
  mousePosition?: Point2d,
) => {
  if (!mousePosition) {
    return null
  }
  const closestConnection = findClosestConnection(windowFrom, mousePosition)
  const distFrom = createCircleMargins(closestConnection.fromSide, false)
  const lineBetweenCircles = closestLineBetweenCircles(
    {
      center: {
        x: closestConnection.from.x + distFrom.x,
        y: closestConnection.from.y + distFrom.y,
      },
      radius: circle.fromRadius,
    },
    {
      center: {
        x: mousePosition.x,
        y: mousePosition.y,
      },
      radius: 1,
    },
  )
  const lineBetweenCirclesDistance = distance(
    [lineBetweenCircles.from.x, lineBetweenCircles.from.y],
    [lineBetweenCircles.to.x, lineBetweenCircles.to.y],
  )

  const createdDimensions = createDimensions(
    {
      ...windowFrom,
      ...lineBetweenCircles.from,
    },
    {
      id: 'mouse',
      zIndex: 0,
      width: 1,
      height: 1,
      ...mousePosition,
    },
  )
  return {
    dimensions: createdDimensions,
    line: lineBetweenCircles,
    distance: lineBetweenCirclesDistance,
  }
}

const findClosestConnection = (from: Window, to: Point2d) => {
  const fromPossible = [...SIDES]
  const fromPoints = calculateConnectionPoints(from)
  let closest = {
    from: fromPoints[fromPossible[0]],
    to: to,
    distance: Infinity,
    fromSide: fromPossible[0],
  }
  for (let i = 0; i < fromPossible.length; i++) {
    const fromPoint = fromPoints[fromPossible[i]]

    const dis = distance([fromPoint.x, fromPoint.y], [to.x, to.y])
    if (!closest || Number(dis) < closest.distance) {
      closest = {
        from: fromPoint,
        to: to,
        distance: Number(dis),
        fromSide: fromPossible[i],
      }
    }
  }

  return closest
}
