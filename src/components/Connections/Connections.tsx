import { useAppStore } from '@/state/state'

import type { FC } from 'react'
import React from 'react'
import { Window } from '@/state/windows'
import { distance } from 'mathjs'
import { IoIosArrowForward } from 'react-icons/io'
import styles from './Connections.module.scss'
import { SIDES, Side } from '@/state/connections'

const circle = {
  radius: 15,
  margin: 10,
}

const Connection = ({
  from,
  to,
  isActive,
}: {
  from: Window
  to: Window
  isActive?: boolean
}) => {
  const { dimensions, line, distance } = createLine(from, to)
  return (
    <div
      className={styles.wrapper}
      style={{
        width: dimensions.width,
        left: dimensions.left,
        top: dimensions.top,
        height: dimensions.height,
      }}
    >
      <div
        className={styles.line}
        style={{
          width: distance.toString() + 'px',
          transform: `rotate(${calculateAngle(
            line.from.x,
            line.from.y,
            line.to.x,
            line.to.y,
          )}deg)`,
          background: isActive
            ? `repeating-linear-gradient(
            to right,
            #d8d8d8,
            #d8d8d8 10px,
            transparent 10px,
            transparent 20px
          )`
            : undefined,
        }}
      >
        <IoIosArrowForward />
      </div>
    </div>
  )
}

export const Connections: FC = () => {
  const state = useAppStore((state) => ({
    connections: state.connections,
    openWindows: state.windows,
    activeConnection: state.activeConnection,
    hoveredConnection: state.hoveredConnection,
  }))
  const activeWindow = state.openWindows.find(
    (window) => window.id === state.activeConnection?.from.id,
  )
  const hoveredWindow = state.openWindows.find(
    (window) => window.id === state.hoveredConnection?.to.id,
  )
  return (
    <>
      {activeWindow && hoveredWindow && (
        <Connection from={activeWindow} to={hoveredWindow} isActive={true} />
      )}
      {state.connections.map((connection) => {
        const windowFrom = state.openWindows.find(
          (window) => window.id === connection.from.id,
        )
        const windowTo = state.openWindows.find(
          (window) => window.id === connection.to.id,
        )

        if (!windowFrom || !windowTo) {
          return null
        }

        return (
          <Connection
            key={connection.to.id + connection.from.id}
            from={windowFrom}
            to={windowTo}
          />
        )
      })}
    </>
  )
}

const createLine = (windowFrom: Window, windowTo: Window) => {
  const closestConnection = findClosestConnection(windowFrom, windowTo) as {
    from: { x: number; y: number }
    to: { x: number; y: number }
    distance: number
    toSide: Side
    fromSide: Side
  }
  const distTo = createCircleMargins(closestConnection.toSide)
  const distFrom = createCircleMargins(closestConnection.fromSide)
  const lineBetweenCircles = closestLineBetweenCircles(
    {
      center: {
        x: closestConnection.from.x + distFrom.x,
        y: closestConnection.from.y + distFrom.y,
      },
      radius: circle.radius,
    },
    {
      center: {
        x: closestConnection.to.x + distTo.x,
        y: closestConnection.to.y + distTo.y,
      },
      radius: circle.radius,
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
    distance: lineBetweenCirclesDistance,
  }
}

const createCircleMargins = (side: Side) => {
  const total = circle.radius + circle.margin

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

type Circle = {
  center: { x: number; y: number }
  radius: number
}

function closestLineBetweenCircles(from: Circle, to: Circle) {
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

function calculateAngle(x1: number, y1: number, x2: number, y2: number): number {
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

const calculateConnectionPoints = (window: Window) => {
  const { x, y, width, height } = window
  const cd = 0
  const top = { y: y - cd, x: x + width / 2 }
  const bottom = { y: y + height + cd, x: x + width / 2 }
  const left = { y: y + height / 2, x: x - cd }
  const right = { y: y + height / 2, x: x + width + cd }
  return { top, bottom, left, right }
}

const findClosestConnection = (from: Window, to: Window) => {
  const fromPossible = [...SIDES]
  const toPossible = [...SIDES]
  const fromPoints = calculateConnectionPoints(from)
  const toPoints = calculateConnectionPoints(to)
  let closest
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

const isFromHigher = (from: Window, to: Window) => from.y < to.y
const isFromLeft = (from: Window, to: Window) => from.x < to.x

const createDimensions = (from: Window, to: Window) => {
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
