import { ConnectionsStore } from './connections'
import { ItemsStore } from './items'
import { WindowsStore } from './windows'
import { createMockItem } from '@/mock/mock-items'
import {
  createManyMockConnectionsToOneWindow,
  createMockConnection,
} from '@/mock/mock-connections'
import { createMockWindow } from '@/mock/mock-windows'

export class MocksStore {
  private readonly connectionStore: ConnectionsStore
  private readonly itemsStore: ItemsStore
  private readonly windowsStore: WindowsStore

  constructor(props: {
    connections: ConnectionsStore
    itemStore: ItemsStore
    windowsStore: WindowsStore
  }) {
    this.connectionStore = props.connections
    this.itemsStore = props.itemStore
    this.windowsStore = props.windowsStore
  }

  createMocks = (length: number) => {
    const items = createMockItem(length)
    const connections = [
      ...createMockConnection(items),
      ...createManyMockConnectionsToOneWindow(items),
    ]
    const connectionsSet = new Set(connections)
    this.itemsStore.addItems(items)
    this.connectionStore.setConnections([...connectionsSet])
    this.windowsStore.setWindows(createMockWindow(items))
  }

  clear = () => {
    this.itemsStore.setItems([])
    this.connectionStore.setConnections([])
    this.windowsStore.setWindows([])
  }
}
