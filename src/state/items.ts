import { AppStateCreator, Setter, stateSetter } from './state'

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

export type ItemListStore = {
  items: Item[]
  setItems: Setter<Item[]>
  deleteItem: (id: string) => void

  hoveredItem: string | null
  setHoveredItem: Setter<string | null>
}

export const itemListStore: AppStateCreator<ItemListStore> = (set) => ({
  items: [],
  setItems: (setter) => stateSetter(set, setter, `items`),
  deleteItem: (id) =>
    set((state) => ({
      items: state.items.filter((Item) => Item.id !== id),
      connections: state.connections.filter(
        (connection) => connection.id.includes(id) === false,
      ),
    })),

  hoveredItem: null,
  setHoveredItem: (setter) => stateSetter(set, setter, `hoveredItem`),
})
