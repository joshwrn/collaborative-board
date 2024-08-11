import { useGesture } from '@use-gesture/react'

import React from 'react'
import { useStore } from './state/gen-state'
import { SPACE_ATTRS } from './state/space'

export const clampInto =
  ([min, max]: [number, number]) =>
  (value: number): number =>
    value < min ? min : value > max ? max : value

const clampZ = clampInto([SPACE_ATTRS.min.zoom, SPACE_ATTRS.max.zoom])

const MOUSE_BUTTONS = {
  middle: 4,
}

export const useGestures = ({
  wrapperRef,
  spaceRef,
}: {
  wrapperRef: React.RefObject<HTMLDivElement>
  spaceRef: React.RefObject<HTMLDivElement>
}) => {
  const state = useStore([
    'contextMenu',
    'zoom',
    'pan',
    'setZoom',
    'setPan',
    'selectedWindow',
    'hoveredWindow',
    'setState',
  ])

  usePreventDefaults()
  useGesture(
    {
      onWheel: (data) => {
        if (isWheelEndEvent(Date.now())) {
          return
        }
        if (!spaceRef.current) return
        const { event } = data
        const delta = normalizeWheel(event)
        if (delta.x === 0 && delta.y === 0) return
        if (delta.z) {
          const space = spaceRef.current.getBoundingClientRect()
          const newZoom = clampZ(state.zoom + delta.z)
          const zoomFocusPointX = event.clientX - space.left
          const zoomFocusPointY = event.clientY - space.top
          const zoomFocusPointOnScreenX = zoomFocusPointX / state.zoom
          const zoomFocusPointOnScreenY = zoomFocusPointY / state.zoom
          const offset = newZoom - state.zoom
          const offSetX = zoomFocusPointOnScreenX * offset
          const offSetY = zoomFocusPointOnScreenY * offset

          state.setZoom((prev) => newZoom)
          state.setPan((prev) => ({
            x: prev.x - offSetX,
            y: prev.y - offSetY,
          }))
        }
        if ((delta.x || delta.y) && !delta.z) {
          // if (
          //   state.selectedWindow &&
          //   state.hoveredWindow === state.selectedWindow
          // ) {
          //   return
          // }
          state.setPan((prev) => ({
            x: prev.x + delta.x,
            y: prev.y + delta.y,
          }))
        }
      },
      onMove: (data) => {
        const { event, pinching } = data
        if (pinching) return
        if (event.buttons === MOUSE_BUTTONS.middle) {
          const movement = {
            x: event.movementX,
            y: event.movementY,
          }
          const newPosition = {
            x: state.pan.x + movement.x,
            y: state.pan.y + movement.y,
          }
          state.setPan({
            x: newPosition.x,
            y: newPosition.y,
          })
        }
      },
    },
    {
      target: wrapperRef,
    },
  )
}
export function normalizeWheel(
  event: React.WheelEvent<HTMLElement> | WheelEvent,
): {
  x: number
  y: number
  z: number
} {
  let { deltaY, deltaX } = event
  let deltaZ = 0

  if (event.ctrlKey || event.altKey || event.metaKey) {
    const signY = Math.sign(event.deltaY)
    const absDeltaY = Math.abs(event.deltaY)

    let dy = deltaY

    if (absDeltaY > MAX_ZOOM_STEP) {
      dy = MAX_ZOOM_STEP * signY
    }

    deltaZ = dy / 100
  } else {
    if (event.shiftKey && !IS_DARWIN) {
      deltaX = deltaY
      deltaY = 0
    }
  }

  return { x: -deltaX, y: -deltaY, z: -deltaZ }
}

const MAX_ZOOM_STEP = 10
const IS_DARWIN = /Mac|iPod|iPhone|iPad/.test(
  typeof window === `undefined` ? `node` : window.navigator.platform,
)

let lastWheelTime = undefined as number | undefined

export const isWheelEndEvent = (time: number): boolean => {
  if (lastWheelTime === undefined) {
    lastWheelTime = time
    return false
  }

  if (time - lastWheelTime > 120 && time - lastWheelTime < 160) {
    lastWheelTime = time
    return true
  }

  lastWheelTime = time
  return false
}

export const usePreventDefaults = (): void => {
  React.useEffect(() => {
    const handler = (e: Event) => e.preventDefault()
    document.addEventListener(
      `wheel`,
      function (e) {
        if (e.ctrlKey && e.type === `wheel`) {
          handler(e)
          e.stopPropagation()
        }
      },
      {
        passive: false, // Add this
      },
    )
    document.addEventListener(`keydown`, function (event) {
      if (event.ctrlKey) {
        handler(event)
      }
    })
    document.addEventListener(`gesturestart`, handler)
    document.addEventListener(`gesturechange`, handler)
    document.addEventListener(`gestureend`, handler)
    return () => {
      document.removeEventListener(`gesturestart`, handler)
      document.removeEventListener(`gesturechange`, handler)
      document.removeEventListener(`gestureend`, handler)
    }
  }, [])
}
