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

function rotatePoint(point: Point2d, angle: number, center: Point2d): Point2d {
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
  }
}

function getRectangleCorners(
  x: number,
  y: number,
  width: number,
  height: number,
  angle: number,
): Record<RotationPoint, Point2d> {
  const center = { x: x + width / 2, y: y + height / 2 }
  const halfWidth = width / 2
  const halfHeight = height / 2

  const corners: Record<RotationPoint, Point2d> = {
    topLeft: { x: center.x - halfWidth, y: center.y - halfHeight },
    topRight: { x: center.x + halfWidth, y: center.y - halfHeight },
    bottomRight: { x: center.x + halfWidth, y: center.y + halfHeight },
    bottomLeft: { x: center.x - halfWidth, y: center.y + halfHeight },
  }

  return {
    topLeft: rotatePoint(corners.topLeft, angle, center),
    topRight: rotatePoint(corners.topRight, angle, center),
    bottomRight: rotatePoint(corners.bottomRight, angle, center),
    bottomLeft: rotatePoint(corners.bottomLeft, angle, center),
  }
}

export const snappingStore: AppStateCreator<SnappingStore> = (set, get) => ({
  isSnappingOn: false,
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

      const {
        topLeft: curWindowTopLeft,
        topRight: curWindowTopRight,
        bottomRight: curWindowBottomRight,
        bottomLeft: curWindowBottomLeft,
      } = getRectangleCorners(
        currentWindow.x,
        currentWindow.y,
        currentWindow.width,
        currentWindow.height,
        currentWindow.rotation,
      )

      const curWindowLeft = curWindowTopLeft.x
      const curWindowTop = curWindowTopLeft.y
      const curWindowRight = curWindowTopRight.x
      const curWindowBottom = curWindowBottomRight.y

      const {
        topLeft: windowTopLeft,
        topRight: windowTopRight,
        bottomRight: windowBottomRight,
        bottomLeft: windowBottomLeft,
      } = getRectangleCorners(
        window.x,
        window.y,
        window.width,
        window.height,
        window.rotation,
      )

      const windowLeft = windowTopLeft.x
      const windowTop = windowTopLeft.y
      const windowRight = windowTopRight.x
      const windowBottom = windowBottomRight.y

      state.debug_setRotationPoints({
        topLeft: windowTopLeft,
        topRight: windowTopRight,
        bottomRight: windowBottomRight,
        bottomLeft: windowBottomLeft,
      })

      const inRange: {
        x: Record<SnapPointsX, boolean>
        y: Record<SnapPointsY, boolean>
      } = {
        y: {
          topToTop: Math.abs(curWindowTop - windowTop) < snapDistance,
          bottomToBottom:
            Math.abs(curWindowBottom - windowBottom) < snapDistance,
          topToBottom: Math.abs(windowTop - curWindowBottom) < snapDistance,
          bottomToTop: Math.abs(windowBottom - curWindowTop) < snapDistance,
        },

        x: {
          leftToLeft: Math.abs(curWindowLeft - windowLeft) < snapDistance,
          rightToRight: Math.abs(curWindowRight - windowRight) < snapDistance,
          leftToRight: Math.abs(windowLeft - curWindowRight) < snapDistance,
          rightToLeft: Math.abs(windowRight - curWindowLeft) < snapDistance,
        },
      }

      const isPointCloser = isPointCloserFn(window, currentWindow)

      if (inRange.y.topToTop) {
        snapTo.y = curWindowTop
        const dir = windowLeft > curWindowLeft ? -1 : 1
        if (isPointCloser(snappingToPositions.topToTop)) {
          snappingToPositions.topToTop = {
            from: {
              x: snapTo.x,
              y: curWindowTop,
            },
            to: {
              x: curWindowLeft,
              y: curWindowTop,
            },
            dir,
          }
        }
      }
      if (inRange.y.bottomToBottom) {
        snapTo.y = curWindowBottom - window.height
        const dir = windowLeft > curWindowLeft ? -1 : 1
        if (isPointCloser(snappingToPositions.bottomToBottom)) {
          snappingToPositions.bottomToBottom = {
            from: {
              x: snapTo.x,
              y: curWindowBottom,
            },
            to: {
              x: curWindowLeft,
              y: curWindowBottom,
            },
            dir,
          }
        }
      }
      if (inRange.y.bottomToTop) {
        snapTo.y = curWindowTop - window.height
        const dir = windowLeft > curWindowLeft ? -1 : 1
        if (isPointCloser(snappingToPositions.bottomToTop)) {
          snappingToPositions.bottomToTop = {
            from: {
              x: snapTo.x,
              y: curWindowTop,
            },
            to: {
              x: curWindowLeft,
              y: curWindowTop,
            },
            dir,
          }
        }
      }
      if (inRange.y.topToBottom) {
        snapTo.y = curWindowBottom
        const dir = windowLeft > curWindowLeft ? -1 : 1
        if (isPointCloser(snappingToPositions.topToBottom)) {
          snappingToPositions.topToBottom = {
            from: {
              x: snapTo.x,
              y: curWindowBottom,
            },
            to: {
              x: curWindowLeft,
              y: curWindowBottom,
            },
            dir,
          }
        }
      }

      if (inRange.x.leftToLeft) {
        snapTo.x = curWindowLeft
        const dir = windowTop > curWindowTop ? -1 : 1
        if (isPointCloser(snappingToPositions.leftToLeft)) {
          snappingToPositions.leftToLeft = {
            from: {
              x: curWindowLeft,
              y: snapTo.y,
            },
            to: {
              x: curWindowLeft,
              y: curWindowTop,
            },
            dir,
          }
        }
      }
      if (inRange.x.leftToRight) {
        snapTo.x = curWindowRight
        const dir = windowTop > curWindowTop ? -1 : 1
        if (isPointCloser(snappingToPositions.leftToRight)) {
          snappingToPositions.leftToRight = {
            from: {
              x: curWindowRight,
              y: snapTo.y,
            },
            to: {
              x: curWindowRight,
              y: curWindowTop,
            },
            dir,
          }
        }
      }
      if (inRange.x.rightToLeft) {
        snapTo.x = curWindowLeft - window.width
        const dir = windowTop > curWindowTop ? -1 : 1
        if (isPointCloser(snappingToPositions.rightToLeft)) {
          snappingToPositions.rightToLeft = {
            from: {
              x: curWindowLeft,
              y: snapTo.y,
            },
            to: {
              x: curWindowLeft,
              y: curWindowTop,
            },
            dir,
          }
        }
      }
      if (inRange.x.rightToRight) {
        snapTo.x = curWindowRight - window.width
        const dir = windowTop > curWindowTop ? -1 : 1
        if (isPointCloser(snappingToPositions.rightToRight)) {
          snappingToPositions.rightToRight = {
            from: {
              x: curWindowRight,
              y: snapTo.y,
            },
            to: {
              x: curWindowRight,
              y: curWindowTop,
            },
            dir,
          }
        }
      }
    }
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
