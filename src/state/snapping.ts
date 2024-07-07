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
  label: RotationPoint
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

  snapToWindows: (id, draggedWindow) => {
    const state = get()
    const isSnapping = state.isSnappingOn
    if (!isSnapping) {
      state.setOneWindow(id, { x: draggedWindow.x, y: draggedWindow.y })
      return
    }
    const openWindows = state.windows
    const openWindow = openWindows.find((window) => window.id === id)
    if (!openWindow) {
      throw new Error(`window ${id} not found`)
    }
    const snapDistance = 50
    const snapTo = { x: draggedWindow.x, y: draggedWindow.y }
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

      const draggedWindowPoints = getRectangleCorners(
        draggedWindow.x,
        draggedWindow.y,
        draggedWindow.width,
        draggedWindow.height,
        draggedWindow.rotation,
      )

      for (const draggedWindowPoint of draggedWindowPoints) {
        for (const curWindowPoint of curWindowPoints) {
          const yInRange =
            Math.abs(draggedWindowPoint.y - curWindowPoint.y) <= snapDistance
          const xInRange =
            Math.abs(draggedWindowPoint.x - curWindowPoint.x) <= snapDistance
          if (yInRange) {
            // lines appear horizontal
            // visual of y snapping
            // o <------------------- o <-- snap point
            snapTo.y = draggedWindow.y - draggedWindowPoint.y + curWindowPoint.y
            const dir = draggedWindowPoint.x < curWindowPoint.x ? 1 : -1
            snapLines.push({
              from: {
                x: NaN,
                y: curWindowPoint.y,
              },
              to: curWindowPoint,
              label: draggedWindowPoint.label,
              realSnap: snapTo.y,
              dir,
              axis: 'y',
            })
          }
          if (xInRange) {
            // lines appear vertical
            // visual of x snapping
            // o <-- snap point
            // |
            // o
            snapTo.x = draggedWindow.x - draggedWindowPoint.x + curWindowPoint.x
            const dir = draggedWindowPoint.y < curWindowPoint.y ? 1 : -1
            snapLines.push({
              from: {
                x: curWindowPoint.x,
                y: NaN,
              },
              to: curWindowPoint,
              realSnap: snapTo.x,
              label: draggedWindowPoint.label,
              dir,
              axis: 'x',
            })
          }
        }
      }
    }

    // const isPointCloser = isPointCloserFn(window, currentWindow)

    // if selected snap point does not align with the window, remove it
    // margin of error because javascript is bad at math
    const snappedWindowPoints = getRectangleCorners(
      snapTo.x,
      snapTo.y,
      draggedWindow.width,
      draggedWindow.height,
      draggedWindow.rotation,
    )
    const marginOfError = 0.01
    const refined: SnappingToPosition[] = []
    for (const snapPoint of snapLines) {
      const thisSnapPoint = snappedWindowPoints.find(
        (point) => point.label === snapPoint.label,
      )
      if (!thisSnapPoint) {
        throw new Error(`snap point ${snapPoint.label} not found`)
      }
      if (snapPoint.axis === 'y') {
        const yPos = snapPoint.realSnap
        const doesAlignToTop = Math.abs(yPos - snapTo.y) <= marginOfError
        const doesAlignToBottom =
          Math.abs(yPos - (snapTo.y + draggedWindow.height)) <= marginOfError
        if (doesAlignToTop || doesAlignToBottom) {
          refined.push({
            ...snapPoint,
            from: { x: thisSnapPoint.x, y: snapPoint.from.y },
          })
        }
      }
      if (snapPoint.axis === 'x') {
        const xPos = snapPoint.realSnap
        const doesAlignToLeft = Math.abs(xPos - snapTo.x) <= marginOfError
        const doesAlignToRight =
          Math.abs(xPos - (snapTo.x + draggedWindow.width)) <= marginOfError
        if (doesAlignToLeft || doesAlignToRight) {
          refined.push({
            ...snapPoint,
            from: { x: snapPoint.from.x, y: thisSnapPoint.y },
          })
        }
      }
    }
    set((state) => ({
      snapLines: refined,
    }))
    state.setOneWindow(id, {
      x: snapTo.x,
      y: snapTo.y,
    })
  },
})
