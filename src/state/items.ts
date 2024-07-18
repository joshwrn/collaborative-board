// import { updateArrayItem } from '@/utils/updateArrayItem'
import { produce } from 'immer'
import { AppStateCreator, Setter, stateSetter } from './state'
import { AppStore } from './gen-state'

export type Iframe = {
  src: string
  [key: string]: string
}

export type CanvasData = {
  blob: string
}

export const ItemBodyTypes = ['text', 'iframe', 'canvas'] as const
export type ItemBodyType = (typeof ItemBodyTypes)[number]

export type ItemBody =
  | {
      content: string
      id: string
      type: 'text'
    }
  | {
      content: Iframe
      id: string
      type: 'iframe'
    }
  | {
      content: CanvasData
      id: string
      type: 'canvas'
    }

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

  addContentToItem: (id: string, content: ItemBody) => void
  editItemContent: (id: string, content: ItemBody) => void
}

export const itemListStore: AppStateCreator<ItemListStore> = (set, get) => ({
  items: [],
  setItems: (setter) => stateSetter(set, setter, `items`),
  deleteItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
      connections: state.connections.filter(
        (connection) => connection.id.includes(id) === false,
      ),
    })),

  hoveredItem: null,
  setHoveredItem: (setter) => stateSetter(set, setter, `hoveredItem`),
  addContentToItem: (id, content) => {
    set(
      produce<AppStore>((state) => {
        const item = state.items.find((item) => item.id === id)
        if (item) {
          item.body.push(content)
        }
      }),
    )
  },

  editItemContent: (id, content) => {
    set(
      produce<AppStore>((state) => {
        const item = state.items.find((item) => item.id === id)
        if (item) {
          const body = item.body.find((body) => body.id === content.id)
          if (body) {
            body.content = content.content
          }
        }
      }),
    )
  },
})
