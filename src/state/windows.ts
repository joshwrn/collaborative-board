import { nanoid } from 'nanoid'
import { z } from 'zod'

import { doRectanglesOverlap } from '@/logic/doRectanglesOverlap'
import { spaceCenterPoint } from '@/logic/spaceCenterPoint'
import { createMockPrompt } from '@/mock/mock-items'

import type { Point2d } from '.'
import { useFullStore } from './gen-state'
import type { AppStateCreator, Setter } from './state'
import { stateSetter } from './state'

export const windowSchema = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  zIndex: z.number(),
  rotation: z.number(),
})
export type WindowType = z.infer<typeof windowSchema>

export interface OpenWindowsStore {
  windows: WindowType[]
  toggleOpenWindow: (id: string) => void
  isResizingWindow: boolean
  resizeWindow: (
    id: string,
    start: { width: number; height: number; x: number; y: number },
    movement: Point2d,
    pos: string,
  ) => void
  setOneWindow: (id: string, update: Partial<WindowType>) => void
  organizeWindows: () => void
  reorderWindows: (id: string) => void
  closeAllWindows: () => void
  openAllWindows: () => void
  fullScreenWindow: string | null
  setFullScreenWindow: Setter<string | null>
  hoveredWindow: string | null
  pinnedWindow: string | null
  selectedWindow: string | null
  moveWindowNextTo: (id: string, nextId: string) => WindowType
  createNewWindow: () => string
}

export const WINDOW_ATTRS = {
  defaultSize: { width: 1000, height: 750 },
  defaultFullScreenSize: { width: 1000, height: 750 },
  minSize: 300,
  maxSize: 1000,
  zIndex: 0,
}
export const DEFAULT_WINDOW: WindowType = {
  id: ``,
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

const createNewWindowPosition = (
  windows: WindowType[],
  zoom: number,
  pan: Point2d,
) => {
  const centerPoint = spaceCenterPoint(zoom, pan)
  const startingPosition = {
    x: centerPoint.x - WINDOW_ATTRS.defaultSize.width / 2,
    y: centerPoint.y - WINDOW_ATTRS.defaultSize.height / 2,
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
  nextId: string,
) => {
  for (let i = 0; i < windows.length; i++) {
    const window = windows[i]
    if (window.id === nextId) {
      continue
    }
    const overlaps = doRectanglesOverlap(
      {
        x: startingPosition.x,
        y: startingPosition.y,
        width: window.width,
        height: window.height,
      },
      window,
    )
    if (overlaps) {
      startingPosition.y = window.y + window.height + 80
      i = 0
    }
  }
  return startingPosition
}

const PADDING_BETWEEN_WINDOWS = 130

export const openWindowsStore: AppStateCreator<OpenWindowsStore> = (
  set,
  get,
) => ({
  windows: [],
  pinnedWindow: null,

  closeAllWindows: () => {
    const state = get()
    if (state.windows.length === 0) {
      throw new Error(`No windows to close`)
    }
    state.setState(() => ({
      windows: [],
    }))
  },

  openAllWindows: () => {
    const state = get()
    const { items, windows } = state
    if (windows.length === items.length) {
      throw new Error(`All windows are already open`)
    }
    if (windows.length > 0) {
      state.closeAllWindows()
    }
    for (const item of items) {
      state.toggleOpenWindow(item.id)
    }
    state.organizeWindows()
  },

  organizeWindows: () => {
    const state = get()
    state.setState((draft) => {
      for (const window of draft.windows) {
        window.y = 0
      }
    })
    const { connections, zoom, pan, windows } = state
    if (windows.length === 0) {
      throw new Error(`No windows to organize`)
    }
    const windowIds = windows.map((w) => w.id)
    const centerPoint = spaceCenterPoint(zoom, pan)
    const startPoint = {
      x: centerPoint.x - WINDOW_ATTRS.defaultSize.width / 2,
      y: centerPoint.y - WINDOW_ATTRS.defaultSize.height / 2,
    }
    const processedGroups = new Set()
    const processedChildren = new Set()
    let furthestWindowX = startPoint.x
    const recursivelyGroupWindows = (windowIdsToProcess: string[]) => {
      for (const windowId of windowIdsToProcess) {
        // need to get latest position of window every loop
        // otherwise child windows with "from" connections will be positioned wrong
        const from = get().windows.find((w) => w.id === windowId)
        if (!from) {
          throw new Error(`window ${windowId} not found`)
        }
        if (processedGroups.has(windowId) || processedChildren.has(windowId)) {
          continue
        }
        const padding = PADDING_BETWEEN_WINDOWS
        const isNewWindowGroup = from.y === 0
        if (isNewWindowGroup) {
          const notFirstGroup = processedGroups.size === 0 ? 0 : 1
          const newGroupSpacing = (from.width + padding * 3) * notFirstGroup
          const newXPosition = furthestWindowX + newGroupSpacing
          state.setOneWindow(windowId, {
            x: newXPosition,
            y: startPoint.y,
          })
          furthestWindowX = newXPosition
          processedGroups.add(windowId)
        }
        if (!isNewWindowGroup) {
          processedChildren.add(windowId)
        }
        const connectionsTo = connections.filter((c) => c.from === windowId)
        for (const connectionTo of connectionsTo) {
          const updatedWindow = state.moveWindowNextTo(windowId, connectionTo.to)
          const newXPosition = updatedWindow.x + updatedWindow.width + padding
          if (newXPosition > furthestWindowX) {
            furthestWindowX = newXPosition
          }
        }
        recursivelyGroupWindows(connectionsTo.map((c) => c.to))
      }
    }
    recursivelyGroupWindows(windowIds)
  },

  toggleOpenWindow: (id: string) => {
    const state = get()
    const openWindows = state.windows
    const openWindow = openWindows.find((window) => window.id === id)
    if (openWindow) {
      set((prev) => ({
        windows: prev.windows.filter((window) => window.id !== id),
      }))
      return
    }
    const highestZIndex = openWindows.reduce(
      (highest, window) => Math.max(highest, window.zIndex),
      0,
    )
    state.setState((draft) => {
      draft.windows.push({
        id,
        ...createNewWindowPosition(draft.windows, state.zoom, state.pan),
        width: WINDOW_ATTRS.defaultSize.width,
        height: WINDOW_ATTRS.defaultSize.height,
        zIndex: highestZIndex + 1,
        rotation: 0,
      })
    })
  },

  createNewWindow: () => {
    const state = get()
    const id = nanoid()
    const prompt = createMockPrompt()
    state.createItem({
      id: id,
      subject: prompt,
      body: [
        {
          id: nanoid(),
          type: `text`,
          content: prompt,
        },
        {
          id: nanoid(),
          type: `canvas`,
          content: {
            base64: ``,
          },
        },
      ],
    })
    state.toggleOpenWindow(id)

    return id
  },

  moveWindowNextTo: (id, newId) => {
    const state = get()
    const openWindows = state.windows
    const generatingFromWindow = openWindows.find((window) => window.id === id)
    if (!generatingFromWindow) {
      throw new Error(`window ${id} not found`)
    }
    state.setState((draft) => {
      for (const window of draft.windows) {
        if (window.id === newId) {
          const newPosition = createNextWindowPosition(
            draft.windows,
            {
              x:
                generatingFromWindow.x +
                generatingFromWindow.width +
                PADDING_BETWEEN_WINDOWS,
              y: generatingFromWindow.y,
            },
            newId,
          )
          window.x = newPosition.x
          window.y = newPosition.y
          window.zIndex = draft.windows.length
          continue
        }
        window.zIndex = window.zIndex - 1
      }
    })
    const updatedWindow = get().windows.find((w) => w.id === id)
    if (!updatedWindow) {
      throw new Error(`window ${id} not found`)
    }
    return updatedWindow
  },

  setOneWindow: (id, update) => {
    const state = get()
    state.setState((draft) => {
      const window = draft.windows.find((w) => w.id === id)
      if (!window) {
        throw new Error(`window ${id} not found`)
      }
      Object.assign(window, update)
    })
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

  isResizingWindow: false,
  resizeWindow: (id, start, movement, pos) => {
    const state = get()
    const window = state.windows.find((prev) => prev.id === id)
    if (!window) {
      throw new Error(`window ${id} not found`)
    }
    const position = { x: window.x, y: window.y }

    let newSize = { width: window.width, height: window.height }
    let newPosition = { x: position.x, y: position.y }
    const { zoom } = state

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
      case `left`: {
        newSize.width = start.width - scaledMovement.x
        newPosition.x = createNewPosition.x()
        break
      }
      case `topLeft`: {
        newSize = {
          width: start.width - scaledMovement.x,
          height: start.height - scaledMovement.y,
        }
        newPosition.x = createNewPosition.x()
        newPosition.y = createNewPosition.y()
        break
      }
      case `top`: {
        newSize.height = start.height - scaledMovement.y
        newPosition.y = createNewPosition.y()
        break
      }
      case `topRight`: {
        newSize = {
          width: start.width + scaledMovement.x,
          height: start.height - scaledMovement.y,
        }
        newPosition.y = createNewPosition.y()
        break
      }
      case `right`: {
        newSize.width = start.width + scaledMovement.x
        break
      }
      case `bottomRight`: {
        newSize = {
          width: start.width + scaledMovement.x,
          height: start.height + scaledMovement.y,
        }
        break
      }
      case `bottom`: {
        newSize.height = start.height + scaledMovement.y
        break
      }
      case `bottomLeft`: {
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
