import { AppStateCreator, Setter, stateSetter } from './state'

export type Iframe = {
  src: string
  [key: string]: string
}

export type CanvasData = {
  blob: string
}

export type ItemBody = string | Iframe | CanvasData

export type Item = {
  id: string
  subject: string
  body: ItemBody[]
  members: string[]
}

export type ItemListStore = {
  items: Item[]
  setItems: Setter<Item[]>
  deleteItem: (id: string) => void

  hoveredItem: string | null
  setHoveredItem: Setter<string | null>

  addContentToItem: (id: string, content: string | Iframe | CanvasData) => void
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
  addContentToItem: (id, content) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, body: [...item.body, content] } : item,
      ),
    })),
})
