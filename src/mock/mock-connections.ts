import { Connection } from '@/state/connections'

import { AMT_OF_WINDOWS } from './mock-windows'
import { Item } from '@/state/items'

export const createMockConnection = (mockItems: Item[]): Connection[] =>
  Array.from({ length: mockItems.length - 2 }, (_, i) => {
    const item = mockItems[i]
    return {
      from: item.id,
      to: mockItems[i + 1].id,
      id: `${item.id}/${mockItems[i + 1].id}`,
    }
  })

export const createManyMockConnectionsToOneWindow = (
  mockItems: Item[],
): Connection[] => {
  const connections = []
  const length = mockItems.length - 1
  for (let i = 0; i < length; i++) {
    const item = mockItems[i]
    if (i % 2 === 0) {
      connections.push({
        from: item.id,
        to: mockItems[length - 1].id,
        id: `${item.id}/${mockItems[length - 1].id}`,
      })
    } else {
      connections.push({
        from: mockItems[length - 1].id,
        to: item.id,
        id: `${mockItems[length - 1].id}/${item.id}`,
      })
    }
  }
  return connections
}
