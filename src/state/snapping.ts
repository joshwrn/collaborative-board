import { distance } from 'mathjs'
import { Point2d } from '.'
import { AppStateCreator, Setter, stateSetter } from './state'
import { WindowType } from './windows'
import { RotationPoint } from '@/components/Window/RotationPoints'

export type SnappingToPosition = {
  from: Point2d
  to: Point2d
  dir: number
}

export const SNAP_POINTS_Y = [
  'topToTop',
  'bottomToBottom',
  'topToBottom',
  'bottomToTop',
] as const
type SnapPointsY = (typeof SNAP_POINTS_Y)[number]

export const SNAP_POINTS_X = [
  'leftToLeft',
  'rightToRight',
  'leftToRight',
  'rightToLeft',
] as const
type SnapPointsX = (typeof SNAP_POINTS_X)[number]

export type SnappingToPositions = {
  [key in SnapPointsY | SnapPointsX]: SnappingToPosition | null
}

export const DEFAULT_SNAPPING_TO_POSITIONS: SnappingToPositions = {
  topToTop: null,
  bottomToBottom: null,
  topToBottom: null,
  bottomToTop: null,

  leftToLeft: null,
  rightToRight: null,
  leftToRight: null,
  rightToLeft: null,
}

export type SnappingStore = {
  snapToWindows: (id: string, newPos: WindowType) => void
  snappingToPositions: SnappingToPositions
  setSnappingToPositions: Setter<SnappingToPositions>
  isSnappingOn: boolean
  setIsSnappingOn: Setter<boolean>
}

const isPointCloserFn = (window: WindowType, currentWindow: Point2d) => {
  return (snapPos: SnappingToPosition | null) => {
    if (!snapPos) {
      return true
    }
    if (
      distance([window.x, window.y], [snapPos.to.x, snapPos.to.y]) >
      distance([window.x, window.y], [currentWindow.x, currentWindow.y])
    ) {
      return true
    }
    return false
  }
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
  snappingToPositions: {
    ...DEFAULT_SNAPPING_TO_POSITIONS,
  },
  setSnappingToPositions: (setter) =>
    stateSetter(set, setter, `snappingToPositions`),

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
    const snapTo = { ...window }
    const snappingToPositions: SnappingToPositions = {
      ...DEFAULT_SNAPPING_TO_POSITIONS,
    }
    const randomPoints: (Point2d & { label: string })[] = []
    for (let i = 0; i < openWindows.length; i++) {
      // if (window.x !== snapTo.x && window.y !== snapTo.y) {
      //   break
      // }
      const currentWindow = openWindows[i]
      if (currentWindow.id === id) {
        continue
      }
      // const curWindowBottom = currentWindow.y + currentWindow.height
      // const curWindowRight = currentWindow.x + currentWindow.width

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

      state.debug_setRotationPoints({
        topLeft: windowPoints[0],
        topRight: windowPoints[1],
        bottomRight: windowPoints[2],
        bottomLeft: windowPoints[3],
      })

      for (const windowPoint of windowPoints) {
        for (const curWindowPoint of curWindowPoints) {
          const yInRange =
            Math.abs(windowPoint.y - curWindowPoint.y) <= snapDistance
          const xInRange =
            Math.abs(windowPoint.x - curWindowPoint.x) <= snapDistance
          if (yInRange) {
            if (
              windowPoint.label === 'topLeft' &&
              curWindowPoint.label === 'topLeft'
            ) {
              const resetPoint = rotatePoint(
                { x: windowPoint.x, y: curWindowPoint.y },
                -window.rotation,
                {
                  x: window.x + window.width / 2,
                  y: window.y + window.height / 2,
                },
                'topLeft',
              )
              snapTo.y = resetPoint.y
              randomPoints.push({
                x: resetPoint.x,
                y: resetPoint.y,
                label: 'topToTop',
              })

              snappingToPositions.topToTop = {
                from: {
                  x: windowPoint.x,
                  y: curWindowPoint.y,
                },
                to: curWindowPoint,
                dir: 1,
              }
            }
          }
        }
      }
    }

    // const isPointCloser = isPointCloserFn(window, currentWindow)

    // update the opposite x and y positions
    // then make sure that each snap point is still valid
    // if selected snap point does not align with the window, remove it
    // margin of error because javascript is bad at math
    // const marginOfError = 0.01
    // for (const snapPoint of SNAP_POINTS_Y) {
    //   const selectedPoint = snappingToPositions[snapPoint]
    //   if (selectedPoint) {
    //     selectedPoint.from.x = snapTo.x

    //     const yPos = selectedPoint.from.y
    //     const doesNotAlignToTop = Math.abs(yPos - snapTo.y) > marginOfError
    //     const doesNotAlignToBottom =
    //       Math.abs(yPos - (snapTo.y + window.height)) > marginOfError

    //     if (doesNotAlignToTop && doesNotAlignToBottom) {
    //       snappingToPositions[snapPoint] = null
    //     }
    //   }
    // }
    // for (const snapPoint of SNAP_POINTS_X) {
    //   const selectedPoint = snappingToPositions[snapPoint]
    //   if (selectedPoint) {
    //     selectedPoint.from.y = snapTo.y

    //     const xPos = selectedPoint.from.x
    //     const doesNotAlignToLeft = Math.abs(xPos - snapTo.x) > marginOfError
    //     const doesNotAlignToRight =
    //       Math.abs(xPos - (snapTo.x + window.width)) > marginOfError

    //     if (doesNotAlignToLeft && doesNotAlignToRight) {
    //       snappingToPositions[snapPoint] = null
    //     }
    //   }
    // }
    set((state) => ({
      snappingToPositions,
    }))

    set((state) => ({
      debug_randomPoints: randomPoints,
    }))
    // const angles = getRectangleCorners(
    //   snapTo.x,
    //   snapTo.y,
    //   window.width,
    //   window.height,
    //   -window.rotation,
    // )
    get().setOneWindow(id, {
      x: snapTo.x,
      y: snapTo.y,
    })
  },
})
