import { distance } from 'mathjs'
import { Point2d } from '.'
import { AppStateCreator, Setter, stateSetter } from './state'
import { WindowType } from './windows'
import { RotationPoint } from '@/components/Window/RotationPoints'

export type SnappingToPosition = {
  from: Point2d
  to: Point2d
  dir: number
  axis: 'x' | 'y'
  realSnap: number
}

export type SnappingStore = {
  snapToWindows: (id: string, newPos: WindowType) => void
  snapLines: SnappingToPosition[]
  setSnapLines: Setter<SnappingToPosition[]>
  isSnappingOn: boolean
  setIsSnappingOn: Setter<boolean>
}

const degToRadians = (deg: number) => (deg * Math.PI) / 180

type PointWithLabel = Point2d & { label: RotationPoint }

function rotatePoint(
  point: Point2d,
  angle: number,
  center: Point2d,
  label: RotationPoint,
): PointWithLabel {
  const radians = degToRadians(angle)
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)

  const translatedX = point.x - center.x
  const translatedY = point.y - center.y

  const rotatedX = translatedX * cos - translatedY * sin
  const rotatedY = translatedX * sin + translatedY * cos

  return {
    x: rotatedX + center.x,
    y: rotatedY + center.y,
    label: label,
  }
}

function getRectangleCorners(
  x: number,
  y: number,
  width: number,
  height: number,
  angle: number,
): [PointWithLabel, PointWithLabel, PointWithLabel, PointWithLabel] {
  const center = { x: x + width / 2, y: y + height / 2 }
  const halfWidth = width / 2
  const halfHeight = height / 2

  const corners: Record<RotationPoint, Point2d> = {
    topLeft: { x: center.x - halfWidth, y: center.y - halfHeight },
    topRight: { x: center.x + halfWidth, y: center.y - halfHeight },
    bottomRight: { x: center.x + halfWidth, y: center.y + halfHeight },
    bottomLeft: { x: center.x - halfWidth, y: center.y + halfHeight },
  }

  return [
    rotatePoint(corners.topLeft, angle, center, 'topLeft'),
    rotatePoint(corners.topRight, angle, center, 'topRight'),
    rotatePoint(corners.bottomRight, angle, center, 'bottomRight'),
    rotatePoint(corners.bottomLeft, angle, center, 'bottomLeft'),
  ]
}

export const snappingStore: AppStateCreator<SnappingStore> = (set, get) => ({
  isSnappingOn: true,
  setIsSnappingOn: (setter) => stateSetter(set, setter, `isSnappingOn`),
  snapLines: [],
  setSnapLines: (setter) => stateSetter(set, setter, `snapLines`),

  snapToWindows: (id, window) => {
    const state = get()
    const isSnapping = state.isSnappingOn
    if (!isSnapping) {
      state.setOneWindow(id, { x: window.x, y: window.y })
      return
    }
    const openWindows = state.windows
    const openWindow = openWindows.find((window) => window.id === id)
    if (!openWindow) {
      throw new Error(`window ${id} not found`)
    }
    const snapDistance = 50
    const snapTo = { x: window.x, y: window.y }
    const snapLines: SnappingToPosition[] = []
    for (let i = 0; i < openWindows.length; i++) {
      const currentWindow = openWindows[i]
      if (currentWindow.id === id) {
        continue
      }

      const curWindowPoints = getRectangleCorners(
        currentWindow.x,
        currentWindow.y,
        currentWindow.width,
        currentWindow.height,
        currentWindow.rotation,
      )

      const windowPoints = getRectangleCorners(
        window.x,
        window.y,
        window.width,
        window.height,
        window.rotation,
      )

      for (const windowPoint of windowPoints) {
        for (const curWindowPoint of curWindowPoints) {
          const yInRange =
            Math.abs(windowPoint.y - curWindowPoint.y) <= snapDistance
          const xInRange =
            Math.abs(windowPoint.x - curWindowPoint.x) <= snapDistance
          if (yInRange) {
            snapTo.y = window.y - windowPoint.y + curWindowPoint.y
            const dir = windowPoint.x < curWindowPoint.x ? 1 : -1
            snapLines.push({
              from: {
                x: windowPoint.x,
                y: curWindowPoint.y,
              },
              to: curWindowPoint,
              realSnap: snapTo.y,
              dir,
              axis: 'y',
            })
          }
          if (xInRange) {
            snapTo.x = window.x - windowPoint.x + curWindowPoint.x
            const dir = windowPoint.y < curWindowPoint.y ? 1 : -1
            snapLines.push({
              from: {
                x: curWindowPoint.x,
                y: windowPoint.y,
              },
              to: curWindowPoint,
              realSnap: snapTo.x,
              dir,
              axis: 'x',
            })
          }
        }
      }
    }

    // const isPointCloser = isPointCloserFn(window, currentWindow)

    // update the opposite x and y positions
    // then make sure that each snap point is still valid
    // if selected snap point does not align with the window, remove it
    // margin of error because javascript is bad at math
    const marginOfError = 0.01
    const filtered = snapLines.filter((snapPoint) => {
      if (snapPoint.axis === 'y') {
        const yPos = snapPoint.realSnap
        const doesNotAlignToTop = Math.abs(yPos - snapTo.y) > marginOfError
        const doesNotAlignToBottom =
          Math.abs(yPos - (snapTo.y + window.height)) > marginOfError
        if (doesNotAlignToTop && doesNotAlignToBottom) {
          return false
        }
      }
      if (snapPoint.axis === 'x') {
        const xPos = snapPoint.realSnap
        const doesNotAlignToLeft = Math.abs(xPos - snapTo.x) > marginOfError
        const doesNotAlignToRight =
          Math.abs(xPos - (snapTo.x + window.width)) > marginOfError
        if (doesNotAlignToLeft && doesNotAlignToRight) {
          return false
        }
      }
      return true
    })
    set((state) => ({
      snapLines: filtered,
    }))
    get().setOneWindow(id, {
      x: snapTo.x,
      y: snapTo.y,
    })
  },
})
