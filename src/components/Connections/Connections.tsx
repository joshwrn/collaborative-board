import { useAppStore } from '@/state/state'

import type { FC } from 'react'
import React from 'react'
import { SIDES, Window } from '@/state/windows'
import { distance } from 'mathjs'

export const Connections: FC = () => {
  const state = useAppStore((state) => ({
    connections: state.connections,
    openWindows: state.windows,
  }))
  return (
    <>
      {state.connections.map((connection) => {
        const from = state.openWindows.find(
          (window) => window.id === connection.from.id,
        )
        const to = state.openWindows.find(
          (window) => window.id === connection.to.id,
        )

        if (!from || !to) return null

        const createdDimensions = createDimensions(from, to)
        const dis = distance(
          [from.x + from.width, from.y + from.height / 2],
          [to.x, to.y + to.height / 2],
        )
        const closestConnection = findClosestConnection(from, to)
        console.log({ closestConnection })

        return (
          <div
            key={connection.from.id + connection.to.id}
            style={{
              position: 'absolute',
              width: createdDimensions.width,
              left: createdDimensions.left,
              top: createdDimensions.top,
              height: createdDimensions.height,
              background:
                'linear-gradient(180deg, rgba(63,94,251,1) 0%, rgba(252,70,237,1) 100%)',
              zIndex: -99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: dis.toString() + 'px',
                height: '2px',
                background: 'white',
                position: 'absolute',
                // transformOrigin: 'bottom left',
                transform: `rotate(${calculateAngle(
                  from.x + from.width,
                  from.y + from.height / 2,
                  to.x,
                  to.y + to.height / 2,
                )}deg)`,
              }}
            ></div>
          </div>
        )
      })}
    </>
  )
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
  const top = { y, x: x + width / 2 }
  const bottom = { y: y + height, x: x + width / 2 }
  const left = { y: y + height / 2, x }
  const right = { y: y + height / 2, x: x + width }
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
      if (!closest || dis < closest.distance) {
        closest = {
          from: fromPossible[i],
          to: toPossible[j],
          distance: dis,
        }
      }
    }
  }
  return closest
}

const isFromHigher = (from: Window, to: Window) => from.y < to.y
const isFromLeft = (from: Window, to: Window) => from.x + from.width < to.x

const createDimensions = (from: Window, to: Window) => {
  let height = 0
  let top = 0
  let left = 0
  let width = 0

  const fromIsHigher = isFromHigher(from, to)
  const fromIsLeft = isFromLeft(from, to)
  top = fromIsHigher ? from.y + from.height / 2 : to.y + to.height / 2
  height = fromIsHigher ? to.y - from.y : from.y - to.y
  left = fromIsLeft ? from.x + from.width : to.x
  width = fromIsLeft ? to.x - from.x - from.width : from.x + from.width - to.x
  return { top, height, left, width }
}
