import React from 'react'
import { WindowsStore } from './windows'
import { Peripheral } from './peripheral'

export const StoreContext = React.createContext<Store | null>(null)

export class Store {
  readonly windows = new WindowsStore()
  readonly peripheral = new Peripheral()

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
