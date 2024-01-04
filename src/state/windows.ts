import { SPACE_ATTRS } from './space'
import { AppStateCreator, Setter, stateSetter } from './state'

export type Window = {
  id: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
}

export type OpenWindowsStore = {
  windows: Window[]
  toggleOpenWindow: (id: string) => void
  resizeWindow: (
    id: string,
    start: { width: number; height: number; x: number; y: number },
    movement: { x: number; y: number },
    pos: string,
  ) => void
  setOneWindow: (id: string, update: Partial<Window>) => void
  reorderWindows: (id: string) => void
}

export const WINDOW_ATTRS = {
  defaultSize: { width: 700, height: 500 },
  minSize: 300,
  maxSize: 1000,
  zIndex: 0,
}

export const newWindowSizeInBounds = (
  newSize: {
    width: number
    height: number
  },
  currentSize: { width: number; height: number },
) => {
  return {
    width:
      newSize.width < WINDOW_ATTRS.minSize ||
      newSize.width > WINDOW_ATTRS.maxSize
        ? currentSize.width
        : newSize.width,
    height:
      newSize.height < WINDOW_ATTRS.minSize ||
      newSize.height > WINDOW_ATTRS.maxSize
        ? currentSize.height
        : newSize.height,
  }
}

const createNewWindowPosition = (windows: Window[]) => {
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
    const createNewPosition = (axis: 'x' | 'y') => {
      if (axis === 'x') {
        if (
          newSize.width < WINDOW_ATTRS.minSize ||
          newSize.width > WINDOW_ATTRS.maxSize
        ) {
          return position[axis]
        }
        return start.x + scaledMovement.x
      }
      if (
        newSize.height < WINDOW_ATTRS.minSize ||
        newSize.height > WINDOW_ATTRS.maxSize
      ) {
        return position[axis]
      }
      return start.y + scaledMovement.y
    }

    switch (pos) {
      case 'left': {
        newSize.width = start.width - scaledMovement.x
        newPosition.x = createNewPosition('x')
        break
      }
      case 'topLeft': {
        newSize = {
          width: start.width - scaledMovement.x,
          height: start.height - scaledMovement.y,
        }
        newPosition.x = createNewPosition('x')
        newPosition.y = createNewPosition('y')
        break
      }
      case 'top': {
        newSize.height = start.height - scaledMovement.y
        newPosition.y = createNewPosition('y')
        break
      }
      case 'topRight': {
        newSize = {
          width: start.width + scaledMovement.x,
          height: start.height - scaledMovement.y,
        }
        newPosition.y = createNewPosition('y')
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
        newPosition.x = createNewPosition('x')
        break
      }
    }

    get().setOneWindow(id, {
      ...newWindowSizeInBounds(newSize, window),
      ...newPosition,
    })
  },
})
