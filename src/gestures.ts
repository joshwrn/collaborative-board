import { useGesture } from '@use-gesture/react'
import {
  AppStateCreator,
  Setter,
  StateCallback,
  stateSetter,
  useAppStore,
} from './state/state'
import React from 'react'

export const clampInto =
  ([min, max]: [number, number]) =>
  (value: number): number =>
    value < min ? min : value > max ? max : value

const clampZ = clampInto([0.25, 1])

export const useGestures = ({
  wrapperRef,
}: {
  wrapperRef: React.RefObject<HTMLDivElement>
}) => {
  const state = useAppStore((state) => ({
    contextMenu: state.contextMenu,
    zoom: state.zoom,
    pan: state.pan,
    setZoom: state.setZoom,
    setPan: state.setPan,
  }))
  usePreventDefaults()
  useGesture(
    {
      onWheel: (data) => {
        // if (!(data.event.target instanceof HTMLCanvasElement)) return
        // pinchRef.current = `not sure`
        if (state.contextMenu) return
        if (isWheelEndEvent(Date.now())) {
          return
        }
        if (!wrapperRef.current) return
        const { event } = data
        const delta = normalizeWheel(event)
        if (delta.x === 0 && delta.y === 0) return
        if (delta.z) {
          const wrapper = wrapperRef.current.getBoundingClientRect()
          if (!wrapper) {
            throw new Error(
              `wrapperRef.current.getBoundingClientRect() is undefined`,
            )
          }
          const newZoom = clampZ(state.zoom + delta.z)
          const offset = state.zoom - newZoom
          const zoomFocusPointX = event.clientX - wrapper.x //- pan.x
          const zoomFocusPointY = event.clientY - wrapper.y //- pan.y
          const zoomFocusPointOnScreenX = zoomFocusPointX / state.zoom
          const zoomFocusPointOnScreenY = zoomFocusPointY / state.zoom
          const offSetX = -(zoomFocusPointOnScreenX * offset)
          const offSetY = -(zoomFocusPointOnScreenY * offset)
          state.setZoom((prev) => newZoom)
          state.setPan((prev) => ({
            x: prev.x - offSetX,
            y: prev.y - offSetY,
          }))
        }
        if ((delta.x || delta.y) && !delta.z) {
          state.setPan((prev) => ({
            x: prev.x + delta.x,
            y: prev.y + delta.y,
          }))
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
