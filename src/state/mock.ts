import {
  createManyMockConnectionsToOneWindow,
  createMockConnection,
} from '@/mock/mock-connections'
import { createMockItem } from '@/mock/mock-items'
import { createMockWindow } from '@/mock/mock-windows'

import type { AppStateCreator } from './state'
import { WINDOW_ATTRS } from './windows'

export interface MockStore {
  createAllMocks: (length: number) => void
  createOneMock: () => void
  clearMocks: () => void
}

export const mockStore: AppStateCreator<MockStore> = (set, get) => ({
  createOneMock: () => {
    const state = get()
    const items = createMockItem(1)
    const connections = createMockConnection(items)
    const centerPoint = state.findSpaceCenterPoint()
    const startingPosition = {
      x: centerPoint.x - WINDOW_ATTRS.defaultSize.width / 2,
      y: centerPoint.y - WINDOW_ATTRS.defaultSize.height / 2,
    }
    set(() => ({
      items: items,
      itemConnections: connections,
      windows: createMockWindow(items, startingPosition),
    }))
  },
  createAllMocks: (length: number) => {
    const items = createMockItem(length)
    const connections = [
      ...createMockConnection(items),
      ...createManyMockConnectionsToOneWindow(items),
    ]
    const connectionsSet = new Set(connections)
    set((state) => ({
      items: items,
      itemConnections: [...connectionsSet],
      windows: createMockWindow(items),
    }))
  },
  clearMocks: () => {
    set(() => ({
      items: [],
      itemConnections: [],
      windows: [],
    }))
  },
})
