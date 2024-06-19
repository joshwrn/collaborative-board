import { AppStateCreator, Setter, stateSetter } from './state'
import {
  createManyMockConnectionsToOneWindow,
  createMockConnection,
} from '@/mock/mock-connections'
import { createMockItem } from '@/mock/mock-items'
import { createMockWindow } from '@/mock/mock-windows'
import { WINDOW_ATTRS } from './windows'

export type MockStore = {
  createAllMocks: (length: number) => void
  createOneMock: () => void
  clearMocks: () => void
}

export const mockStore: AppStateCreator<MockStore> = (set, get) => ({
  createOneMock: () => {
    const items = createMockItem(1)
    const connections = createMockConnection(items)
    const zoom = get().zoom
    set((state) => ({
      items: items,
      connections: connections,
      windows: createMockWindow(items, {
        x: WINDOW_ATTRS.defaultSize.width,
        y: WINDOW_ATTRS.defaultSize.height + 300,
      }),
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
      connections: [...connectionsSet],
      windows: createMockWindow(items),
    }))
  },
  clearMocks: () => {
    set(() => ({
      items: [],
      connections: [],
      windows: [],
    }))
  },
})
