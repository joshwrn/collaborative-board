import { AppStateCreator, Setter, stateSetter } from './state'
import {
  createManyMockConnectionsToOneWindow,
  createMockConnection,
} from '@/mock/mock-connections'
import { createMockItem } from '@/mock/mock-items'
import { createMockWindow } from '@/mock/mock-windows'

export type MockStore = {
  createAllMocks: (length: number) => void
}

export const mockStore: AppStateCreator<MockStore> = (set) => ({
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
})
