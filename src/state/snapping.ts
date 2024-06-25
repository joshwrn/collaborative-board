import { Point2d } from '.'
import { SPACE_ATTRS } from './space'
import { AppStateCreator, Setter, stateSetter } from './state'
import { WindowType } from './windows'

export type SnappingToPosition = {
  from: Point2d
  to: Point2d
  dir: number
}

export type SnappingToPositions = {
  topToTop: SnappingToPosition | null
  bottomToBottom: SnappingToPosition | null
  topToBottom: SnappingToPosition | null
  bottomToTop: SnappingToPosition | null

  leftToLeft: SnappingToPosition | null
  rightToRight: SnappingToPosition | null
  leftToRight: SnappingToPosition | null
  rightToLeft: SnappingToPosition | null
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
      if (window.x !== snapTo.x && window.y !== snapTo.y) {
        break
      }
      const currentWindow = openWindows[i]
      if (currentWindow.id === id) {
        continue
      }
      const curWindowBottom = currentWindow.y + currentWindow.height
      const curWindowRight = currentWindow.x + currentWindow.width
      const windowBottom = window.y + window.height
      const windowRight = window.x + window.width
      const distance: {
        x: Record<SnapPointsX, boolean>
        y: Record<SnapPointsY, boolean>
      } = {
        y: {
          topToTop: Math.abs(currentWindow.y - window.y) < snapDistance,
          bottomToBottom:
            Math.abs(curWindowBottom - windowBottom) < snapDistance,
          topToBottom: Math.abs(window.y - curWindowBottom) < snapDistance,
          bottomToTop: Math.abs(windowBottom - currentWindow.y) < snapDistance,
        },

        x: {
          leftToLeft: Math.abs(currentWindow.x - window.x) < snapDistance,
          rightToRight: Math.abs(curWindowRight - windowRight) < snapDistance,
          leftToRight: Math.abs(window.x - curWindowRight) < snapDistance,
          rightToLeft: Math.abs(windowRight - currentWindow.x) < snapDistance,
        },
      }

      if (distance.y.topToTop) {
        snapTo.y = currentWindow.y
        const dir = window.x > currentWindow.x ? -1 : 1
        snappingToPositions.topToTop = {
          from: {
            x: snapTo.x,
            y: currentWindow.y,
          },
          to: {
            x: currentWindow.x,
            y: currentWindow.y,
          },
          dir,
        }
      }
      if (distance.y.bottomToBottom) {
        snapTo.y = curWindowBottom - window.height
        const dir = window.x > currentWindow.x ? -1 : 1
        snappingToPositions.bottomToBottom = {
          from: {
            x: snapTo.x,
            y: curWindowBottom,
          },
          to: {
            x: currentWindow.x,
            y: curWindowBottom,
          },
          dir,
        }
      }
      if (distance.y.bottomToTop) {
        snapTo.y = currentWindow.y - window.height
        const dir = window.x > currentWindow.x ? -1 : 1
        snappingToPositions.bottomToTop = {
          from: {
            x: snapTo.x,
            y: currentWindow.y,
          },
          to: {
            x: currentWindow.x,
            y: currentWindow.y,
          },
          dir,
        }
      }
      if (distance.y.topToBottom) {
        snapTo.y = curWindowBottom
        const dir = window.x > currentWindow.x ? -1 : 1
        snappingToPositions.topToBottom = {
          from: {
            x: snapTo.x,
            y: curWindowBottom,
          },
          to: {
            x: currentWindow.x,
            y: curWindowBottom,
          },
          dir,
        }
      }

      if (distance.x.leftToLeft) {
        snapTo.x = currentWindow.x
        const dir = window.y > currentWindow.y ? -1 : 1
        snappingToPositions.leftToLeft = {
          from: {
            x: currentWindow.x,
            y: snapTo.y,
          },
          to: {
            x: currentWindow.x,
            y: currentWindow.y,
          },
          dir,
        }
      }
      if (distance.x.leftToRight) {
        snapTo.x = curWindowRight
        const dir = window.y > currentWindow.y ? -1 : 1
        snappingToPositions.leftToRight = {
          from: {
            x: curWindowRight,
            y: snapTo.y,
          },
          to: {
            x: curWindowRight,
            y: currentWindow.y,
          },
          dir,
        }
      }
      if (distance.x.rightToLeft) {
        snapTo.x = currentWindow.x - window.width
        const dir = window.y > currentWindow.y ? -1 : 1
        snappingToPositions.rightToLeft = {
          from: {
            x: currentWindow.x,
            y: snapTo.y,
          },
          to: {
            x: currentWindow.x,
            y: currentWindow.y,
          },
          dir,
        }
      }
      if (distance.x.rightToRight) {
        snapTo.x = curWindowRight - window.width
        const dir = window.y > currentWindow.y ? -1 : 1
        snappingToPositions.rightToRight = {
          from: {
            x: curWindowRight,
            y: snapTo.y,
          },
          to: {
            x: curWindowRight,
            y: currentWindow.y,
          },
          dir,
        }
      }
    }
    // update the opposite x and y positions
    // then make sure that each snap point is still valid
    // if selected snap point does not align with the window, remove it
    // margin of error because javascript is bad at math
    const marginOfError = 0.01
    for (const snapPoint of SNAP_POINTS_Y) {
      const selectedPoint = snappingToPositions[snapPoint]
      if (selectedPoint) {
        selectedPoint.from.x = snapTo.x

        const yPos = selectedPoint.from.y
        const doesNotAlignToTop = Math.abs(yPos - snapTo.y) > marginOfError
        const doesNotAlignToBottom =
          Math.abs(yPos - (snapTo.y + window.height)) > marginOfError

        if (doesNotAlignToTop && doesNotAlignToBottom) {
          snappingToPositions[snapPoint] = null
        }
      }
    }
    for (const snapPoint of SNAP_POINTS_X) {
      const selectedPoint = snappingToPositions[snapPoint]
      if (selectedPoint) {
        selectedPoint.from.y = snapTo.y

        const xPos = selectedPoint.from.x
        const doesNotAlignToLeft = Math.abs(xPos - snapTo.x) > marginOfError
        const doesNotAlignToRight =
          Math.abs(xPos - (snapTo.x + window.width)) > marginOfError

        if (doesNotAlignToLeft && doesNotAlignToRight) {
          snappingToPositions[snapPoint] = null
        }
      }
    }
    set((state) => ({
      snappingToPositions,
    }))
    get().setOneWindow(id, {
      x: snapTo.x,
      y: snapTo.y,
    })
  },
})
