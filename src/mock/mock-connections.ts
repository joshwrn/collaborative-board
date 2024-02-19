import { Connection } from '@/state/connections'
import { MOCK_ITEMS } from './mock-items'
import { AMT_OF_WINDOWS } from './mock-windows'

export const createMockConnection = (length: number): Connection[] =>
  Array.from({ length }, (_, i) => {
    const item = MOCK_ITEMS[i]
    return {
      from: item.id,
      to: MOCK_ITEMS[i + 1].id,
      id: `${item.id}/${MOCK_ITEMS[i + 1].id}`,
    }
  })

export const createManyMockConnectionsToOneWindow = (
  length: number,
): Connection[] => {
  const connections = []
  for (let i = 0; i < length; i++) {
    const item = MOCK_ITEMS[i]
    if (i % 2 === 0) {
      connections.push({
        from: item.id,
        to: MOCK_ITEMS[length - 1].id,
        id: `${item.id}/${MOCK_ITEMS[length - 1].id}`,
      })
    } else {
      connections.push({
        from: MOCK_ITEMS[length - 1].id,
        to: item.id,
        id: `${MOCK_ITEMS[length - 1].id}/${item.id}`,
      })
    }
  }
  return connections
}
