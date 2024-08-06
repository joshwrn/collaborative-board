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
  rotation: number
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
  fullScreenWindow: string | null
  setFullScreenWindow: Setter<string | null>
  hoveredWindow: string | null
  selectedWindow: string | null
  moveWindowNextTo: (id: string, nextId: string) => void
}

export const WINDOW_ATTRS = {
  defaultSize: { width: 1000, height: 600 },
  defaultFullScreenSize: { width: 1000, height: 750 },
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
  rotation: 0,
}

export const newWindowSizeInBounds = (newSize: {
  width: number
  height: number
}) => {
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

const createNextWindowPosition = (
  windows: WindowType[],
  startingPosition: Point2d,
) => {
  for (let i = 0; i < windows.length; i++) {
    const window = windows[i]
    if (window.x === startingPosition.x && window.y === startingPosition.y) {
      startingPosition.x
      startingPosition.y += window.height + 80
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
          rotation: 0,
        },
      ],
    }))
  },

  moveWindowNextTo: (id, nextId) => {
    const openWindows = get().windows
    const openWindow = openWindows.find((window) => window.id === id)
    if (!openWindow) {
      throw new Error(`window ${id} not found`)
    }
    set((state) => ({
      windows: state.windows.map((window) => {
        if (window.id === nextId) {
          return {
            ...window,
            ...createNextWindowPosition(state.windows, {
              x: openWindow.x + openWindow.width + 130,
              y: openWindow.y,
            }),
          }
        }
        return {
          ...window,
          zIndex: window.zIndex - 1,
        }
      }),
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

  resizeWindow: (id, start, movement, pos) => {
    const state = get()
    const window = state.windows.find((window) => window.id === id)
    if (!window) {
      throw new Error(`window ${id} not found`)
    }
    const position = { x: window.x, y: window.y }

    let newSize = { width: window.width, height: window.height }
    let newPosition = { x: position.x, y: position.y }
    const zoom = state.zoom

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

    state.setOneWindow(id, {
      ...newWindowSizeInBounds(newSize),
      ...newPosition,
    })
  },

  fullScreenWindow: null,

  setFullScreenWindow: (setter) => stateSetter(set, setter, `fullScreenWindow`),

  hoveredWindow: null,

  selectedWindow: null,
})
