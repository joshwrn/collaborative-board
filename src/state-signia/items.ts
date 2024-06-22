import { atom, computed } from 'signia'
import { ConnectionsStore } from './connections'

export type Iframe = {
  src: string
  [key: string]: string
}

export type Item = {
  id: string
  subject: string
  body: (string | Iframe)[]
  members: string[]
}

export class ItemsStore {
  private readonly connectionStore: ConnectionsStore

  constructor(props: { connections: ConnectionsStore }) {
    this.connectionStore = props.connections
  }

  private readonly itemsState = atom<Item[]>('Store.items', [])

  @computed get items() {
    return this.itemsState.value
  }

  deleteItem = (id: string) => {
    this.itemsState.update((items) => items.filter((Item) => Item.id !== id))
    this.connectionStore.removeConnection(id)
  }

  addItems = (newItems: Item[]) => {
    this.itemsState.update((items) => [...items, ...newItems])
  }

  setItems = (items: Item[]) => {
    this.itemsState.update(() => items)
  }
}
