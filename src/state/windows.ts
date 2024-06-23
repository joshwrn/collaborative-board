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

export type SnappingToPositions = {
  x: { from: Point2d; to: Point2d } | null
  y: { from: Point2d; to: Point2d } | null
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

  snappingToPositions: {
    x: null,
    y: null,
  },

  snapToWindows: (id, window) => {
    const openWindows = get().windows
    const openWindow = openWindows.find((window) => window.id === id)
    if (!openWindow) {
      throw new Error(`window ${id} not found`)
    }
    const snapDistance = 50
    const snapTo = { ...window }
    const snappingToPositions: SnappingToPositions = { x: null, y: null }
    for (let i = 0; i < openWindows.length; i++) {
      if (window.x !== snapTo.x && window.y !== snapTo.y) {
        break
      }
      const currentWindow = openWindows[i]
      if (currentWindow.id === id) {
        continue
      }
      const bottom = currentWindow.y + currentWindow.height
      const right = currentWindow.x + currentWindow.width
      const distance = {
        x: Math.abs(currentWindow.x - window.x),
        y: Math.abs(currentWindow.y - window.y),
        bottom: Math.abs(bottom - window.y),
        right: Math.abs(right - window.x),
        top: Math.abs(currentWindow.y - (window.y + openWindow.height)),
        left: Math.abs(currentWindow.x - (window.x + openWindow.width)),
      }
      const keys = Object.keys(distance) as (keyof typeof distance)[]

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        if (distance[key] < snapDistance) {
          if (key === 'x') {
            snapTo.x = currentWindow.x
            snappingToPositions.x = {
              from: { x: currentWindow.x, y: currentWindow.y },
              to: { x: window.x, y: window.y },
            }
          }
          if (key === 'y') {
            snapTo.y = currentWindow.y
            snappingToPositions.y = {
              from: { x: currentWindow.x, y: currentWindow.y },
              to: { x: window.x, y: window.y },
            }
          }
          // if (key === 'bottom') {
          //   snapTo.y = bottom
          // }
          // if (key === 'right') {
          //   snapTo.x = right
          // }
          // if (key === 'top') {
          //   snapTo.y = currentWindow.y - openWindow.height
          // }
          // if (key === 'left') {
          //   snapTo.x = currentWindow.x - openWindow.width
          // }
        }
      }
    }
    set((state) => ({
      snappingToPositions,
    }))
    console.log(window, snapTo)
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
