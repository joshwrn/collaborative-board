import { SIDES, Side } from '@/state/connections'
import { Window } from '@/state/windows'
import { distance } from 'mathjs'

export const circle = {
  fromRadius: 15,
  toRadius: 15,
  fromMargin: 10,
  toMargin: 10,
}

export const createLineBetweenWindows = (
  windowFrom: Window,
  windowTo: Window,
): {
  dimensions: { top: number; height: number; left: number; width: number }
  line: { from: { x: number; y: number }; to: { x: number; y: number } }
  distance: number
} => {
  const closestConnection = findClosestConnection(windowFrom, windowTo)
  const distTo = createCircleMargins(closestConnection.toSide, true)
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
        x: closestConnection.to.x + distTo.x,
        y: closestConnection.to.y + distTo.y,
      },
      radius: circle.toRadius,
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
      ...windowTo,
      ...lineBetweenCircles.to,
    },
  )
  return {
    dimensions: createdDimensions,
    line: lineBetweenCircles,
    distance: Number(lineBetweenCirclesDistance),
  }
}

export const createCircleMargins = (side: Side, to: boolean) => {
  const total =
    (to ? circle.toRadius : circle.fromRadius) +
    (to ? circle.toMargin : circle.fromMargin)

  switch (side) {
    case 'top':
      return { x: 0, y: -total }
    case 'bottom':
      return { x: 0, y: total }
    case 'left':
      return { x: -total, y: 0 }
    case 'right':
      return { x: total, y: 0 }
  }
}

export type Circle = {
  center: { x: number; y: number }
  radius: number
}

export function closestLineBetweenCircles(from: Circle, to: Circle) {
  let C1 = from.center
  let C2 = to.center

  let v = { x: C2.x - C1.x, y: C2.y - C1.y }

  let magnitude = Math.sqrt(v.x * v.x + v.y * v.y)
  let unitVector = { x: v.x / magnitude, y: v.y / magnitude }

  let P1 = {
    x: C1.x + from.radius * unitVector.x,
    y: C1.y + from.radius * unitVector.y,
  }
  let P2 = {
    x: C2.x - to.radius * unitVector.x,
    y: C2.y - to.radius * unitVector.y,
  }

  // Return the line segment
  return { from: P1, to: P2 }
}

export const calculateAngleBetweenPoints = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number => {
  const deltaX = x2 - x1
  const deltaY = y2 - y1

  // Calculate the angle in radians
  let angleRad = Math.atan2(deltaY, deltaX)

  // Convert radians to degrees
  let angleDeg = angleRad * (180 / Math.PI)

  // Ensure the angle is positive
  if (angleDeg < 0) {
    angleDeg += 360
  }

  return angleDeg
}

export const calculateConnectionPoints = (window: Window) => {
  const { x, y, width, height } = window
  const cd = 0
  const top = { y: y - cd, x: x + width / 2 }
  const bottom = { y: y + height + cd, x: x + width / 2 }
  const left = { y: y + height / 2, x: x - cd }
  const right = { y: y + height / 2, x: x + width + cd }
  return { top, bottom, left, right }
}

export const findClosestConnection = (from: Window, to: Window) => {
  const fromPossible = [...SIDES]
  const toPossible = [...SIDES]
  const fromPoints = calculateConnectionPoints(from)
  const toPoints = calculateConnectionPoints(to)
  let closest = {
    from: fromPoints[fromPossible[0]],
    to: toPoints[toPossible[0]],
    distance: Infinity,
    toSide: toPossible[0],
    fromSide: fromPossible[0],
  }
  for (let i = 0; i < fromPossible.length; i++) {
    const fromPoint = fromPoints[fromPossible[i]]
    for (let j = 0; j < toPossible.length; j++) {
      const toPoint = toPoints[toPossible[j]]
      const dis = distance([fromPoint.x, fromPoint.y], [toPoint.x, toPoint.y])
      if (!closest || Number(dis) < closest.distance) {
        closest = {
          from: fromPoint,
          to: toPoint,
          distance: Number(dis),
          toSide: toPossible[j],
          fromSide: fromPossible[i],
        }
      }
    }
  }
  return closest
}

export const isFromHigher = (from: Window, to: Window) => from.y < to.y
export const isFromLeft = (from: Window, to: Window) => from.x < to.x

export const createDimensions = (from: Window, to: Window) => {
  let height = 0
  let top = 0
  let left = 0
  let width = 0

  const fromIsHigher = isFromHigher(from, to)
  const fromIsLeft = isFromLeft(from, to)
  top = fromIsHigher ? from.y : to.y
  height = fromIsHigher ? to.y - from.y : from.y - to.y
  left = fromIsLeft ? from.x : to.x
  width = fromIsLeft ? to.x - from.x : from.x - to.x
  return { top, height, left, width }
}
