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
    set((state) => ({
      items: items,
      connections: [
        ...createMockConnection(items),
        ...createManyMockConnectionsToOneWindow(items),
      ],
      windows: createMockWindow(items),
    }))
  },
})
