import { Point2d } from '.'
import { SPACE_ATTRS } from './space'
import { AppStateCreator, Setter, stateSetter } from './state'

export type WindowType = {
  id: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
}

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

export type OpenWindowsStore = {
  windows: WindowType[]
  toggleOpenWindow: (id: string) => void
  resizeWindow: (
    id: string,
    start: { width: number; height: number; x: number; y: number },
    movement: { x: number; y: number },
    pos: string,
  ) => void
  setOneWindow: (id: string, update: Partial<WindowType>) => void
  reorderWindows: (id: string) => void
  fullscreenWindow: (id: string) => void
  snapToWindows: (id: string, newPos: WindowType) => void
  snappingToPositions: SnappingToPositions
  setSnappingToPositions: Setter<SnappingToPositions>
  isSnappingOn: boolean
  setIsSnappingOn: Setter<boolean>
  hoveredWindow: string | null
  setHoveredWindow: Setter<string | null>
}

export const WINDOW_ATTRS = {
  defaultSize: { width: 700, height: 500 },
  minSize: 300,
  maxSize: 1000,
  zIndex: 0,
}
export const DEFAULT_WINDOW: WindowType = {
  id: '',
  x: 0,
  y: 0,
  width: WINDOW_ATTRS.defaultSize.width,
  height: WINDOW_ATTRS.defaultSize.height,
  zIndex: 0,
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

export const newWindowSizeInBounds = (
  newSize: {
    width: number
    height: number
  },
  currentSize: { width: number; height: number },
) => {
  let size = { width: newSize.width, height: newSize.height }
  if (size.width < WINDOW_ATTRS.minSize) {
    size.width = WINDOW_ATTRS.minSize
  }
  if (size.height < WINDOW_ATTRS.minSize) {
    size.height = WINDOW_ATTRS.minSize
  }
  if (size.width > WINDOW_ATTRS.maxSize) {
    size.width = WINDOW_ATTRS.maxSize
  }
  if (size.height > WINDOW_ATTRS.maxSize) {
    size.height = WINDOW_ATTRS.maxSize
  }
  return size
}

const createNewWindowPosition = (windows: WindowType[]) => {
  const startingPosition = {
    x: SPACE_ATTRS.size / 2 - WINDOW_ATTRS.defaultSize.width / 2,
    y: SPACE_ATTRS.size / 2 - WINDOW_ATTRS.defaultSize.height / 2,
  }
  for (let i = 0; i < windows.length; i++) {
    const window = windows[i]
    if (window.x === startingPosition.x && window.y === startingPosition.y) {
      startingPosition.x += 20
      startingPosition.y += 20
      i = 0
    }
  }
  return startingPosition
}

export const openWindowsStore: AppStateCreator<OpenWindowsStore> = (
  set,
  get,
) => ({
  windows: [],

  toggleOpenWindow: (id: string) => {
    const openWindows = get().windows
    const openWindow = openWindows.find((window) => window.id === id)
    if (openWindow) {
      set((state) => ({
        windows: state.windows.filter((window) => window.id !== id),
      }))
      return
    }
    const highestZIndex = openWindows.reduce(
      (highest, window) => Math.max(highest, window.zIndex),
      0,
    )
    set((state) => ({
      windows: [
        ...state.windows,
        {
          id,
          ...createNewWindowPosition(state.windows),
          width: WINDOW_ATTRS.defaultSize.width,
          height: WINDOW_ATTRS.defaultSize.height,
          zIndex: highestZIndex + 1,
        },
      ],
    }))
  },

  setOneWindow: (id, update) => {
    set((state) => ({
      windows: state.windows.map((window) => {
        if (window.id === id) {
          return {
            ...window,
            ...update,
          }
        }
        return window
      }),
    }))
  },

  reorderWindows: (id) => {
    const openWindows = get().windows
    const openWindow = openWindows.find((window) => window.id === id)
    if (!openWindow) {
      throw new Error(`window ${id} not found`)
    }
    set((state) => ({
      windows: state.windows.map((window) => {
        if (window.id === id) {
          return {
            ...window,
            zIndex: state.windows.length,
          }
        }
        return {
          ...window,
          zIndex: window.zIndex - 1,
        }
      }),
    }))
  },

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

  resizeWindow: (id, start, movement, pos) => {
    const window = get().windows.find((window) => window.id === id)
    if (!window) {
      throw new Error(`window ${id} not found`)
    }
    const position = { x: window.x, y: window.y }

    let newSize = { width: window.width, height: window.height }
    let newPosition = { x: position.x, y: position.y }
    const zoom = get().zoom

    const scaledMovement = {
      x: movement.x / zoom,
      y: movement.y / zoom,
    }
    const createNewPosition = {
      x: () => {
        if (newSize.width > WINDOW_ATTRS.maxSize) {
          return start.x - (WINDOW_ATTRS.maxSize - start.width)
        }
        if (newSize.width < WINDOW_ATTRS.minSize) {
          return start.x + (start.width - WINDOW_ATTRS.minSize)
        }
        return start.x + scaledMovement.x
      },
      y: () => {
        if (newSize.height > WINDOW_ATTRS.maxSize) {
          return start.y - (WINDOW_ATTRS.maxSize - start.height)
        }
        if (newSize.height < WINDOW_ATTRS.minSize) {
          return start.y + (start.height - WINDOW_ATTRS.minSize)
        }
        return start.y + scaledMovement.y
      },
    }

    switch (pos) {
      case 'left': {
        newSize.width = start.width - scaledMovement.x
        newPosition.x = createNewPosition.x()
        break
      }
      case 'topLeft': {
        newSize = {
          width: start.width - scaledMovement.x,
          height: start.height - scaledMovement.y,
        }
        newPosition.x = createNewPosition.x()
        newPosition.y = createNewPosition.y()
        break
      }
      case 'top': {
        newSize.height = start.height - scaledMovement.y
        newPosition.y = createNewPosition.y()
        break
      }
      case 'topRight': {
        newSize = {
          width: start.width + scaledMovement.x,
          height: start.height - scaledMovement.y,
        }
        newPosition.y = createNewPosition.y()
        break
      }
      case 'right': {
        newSize.width = start.width + scaledMovement.x
        break
      }
      case 'bottomRight': {
        newSize = {
          width: start.width + scaledMovement.x,
          height: start.height + scaledMovement.y,
        }
        break
      }
      case 'bottom': {
        newSize.height = start.height + scaledMovement.y
        break
      }
      case 'bottomLeft': {
        newSize = {
          width: start.width - scaledMovement.x,
          height: start.height + scaledMovement.y,
        }
        newPosition.x = createNewPosition.x()
        break
      }
    }

    get().setOneWindow(id, {
      ...newWindowSizeInBounds(newSize, window),
      ...newPosition,
    })
  },

  fullscreenWindow: (id) => {
    const curWindow = get().windows.find((window) => window.id === id)
    if (!id || !curWindow) {
      throw new Error(`window ${id} not found`)
    }

    const isMaximized =
      curWindow.width === WINDOW_ATTRS.maxSize &&
      curWindow.height === WINDOW_ATTRS.maxSize
    if (isMaximized) {
      const heightChange = curWindow.height - WINDOW_ATTRS.defaultSize.height
      const widthChange = curWindow.width - WINDOW_ATTRS.defaultSize.width
      const newPosition = {
        x: curWindow.x + widthChange / 2,
        y: curWindow.y + heightChange / 2,
      }
      get().setOneWindow(id, {
        width: WINDOW_ATTRS.defaultSize.width,
        height: WINDOW_ATTRS.defaultSize.height,
        ...newPosition,
      })
      return
    }

    const heightChange = WINDOW_ATTRS.maxSize - curWindow.height
    const widthChange = WINDOW_ATTRS.maxSize - curWindow.width
    const newPosition = {
      x: curWindow.x - widthChange / 2,
      y: curWindow.y - heightChange / 2,
    }
    get().setOneWindow(id, {
      ...newPosition,
      width: WINDOW_ATTRS.maxSize,
      height: WINDOW_ATTRS.maxSize,
    })
  },

  hoveredWindow: null,
  setHoveredWindow: (setter) => stateSetter(set, setter, `hoveredWindow`),
})
