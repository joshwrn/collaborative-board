import { SPACE_ATTRS } from './space'
import { AppStateCreator, Setter, stateSetter } from './state'

type Window = {
  id: string
  x: number
  y: number
  width: number
  height: number
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
}

export const WINDOW_ATTRS = {
  defaultSize: { width: 700, height: 500 },
  minSize: 300,
  maxSize: 1000,
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

export const openWindowsStore: AppStateCreator<OpenWindowsStore> = (
  set,
  get,
) => ({
  windows: [],
  toggleOpenWindow: (id: string) => {
    const openWindow = get().windows.find((window) => window.id === id)
    if (openWindow) {
      set((state) => ({
        windows: state.windows.filter((window) => window.id !== id),
      }))
      return
    }
    set((state) => ({
      windows: [
        ...state.windows,
        {
          id,
          x: SPACE_ATTRS.size / 2 - WINDOW_ATTRS.defaultSize.width / 2,
          y: SPACE_ATTRS.size / 2 - WINDOW_ATTRS.defaultSize.height / 2,
          width: WINDOW_ATTRS.defaultSize.width,
          height: WINDOW_ATTRS.defaultSize.height,
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
        break
      }
    }

    get().setOneWindow(id, {
      ...newWindowSizeInBounds(newSize, window),
      ...newPosition,
    })
  },
})

export type ConnectedWindowsStore = {
  connections: { from: string; to: string }[]
  setConnections: Setter<{ from: string; to: string }[]>
}

export const connectedWindowsStore: AppStateCreator<ConnectedWindowsStore> = (
  set,
  get,
) => ({
  connections: [],
  setConnections: (setter) => stateSetter(set, setter, `connections`),
})
