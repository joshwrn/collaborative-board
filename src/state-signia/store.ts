import React from 'react'
import { WindowsStore } from './windows'
import { Peripheral } from './peripheral'
import { ConnectionsStore } from './connections'
import { ItemsStore } from './items'
import { MocksStore } from './mocks'
import { SpaceStore } from './space'

export const StoreContext = React.createContext<Store | null>(null)

export class Store {
  readonly windows = new WindowsStore()
  readonly peripheral = new Peripheral()
  readonly connections = new ConnectionsStore({
    windowsStore: this.windows,
  })
  readonly items = new ItemsStore({ connections: this.connections })
  readonly mocks = new MocksStore({
    connections: this.connections,
    itemStore: this.items,
    windowsStore: this.windows,
  })
  readonly space = new SpaceStore()

  static useNewStore = () => {
    const doc = React.useMemo(() => new Store(), [])
    // You can add any effects and other lifecycle logic in here
    return doc
  }
}

export const useStore = () => {
  const doc = React.useContext(StoreContext)
  if (!doc) throw new Error('No document found in context')
  return doc
}
