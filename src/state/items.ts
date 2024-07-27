// import { updateArrayItem } from '@/utils/updateArrayItem'
import { produce } from 'immer'
import { AppStateCreator, produceState, Set, Setter, stateSetter } from './state'
import { nanoid } from 'nanoid'
import { AppStore } from './gen-state'

export type Iframe = {
  src: string
  [key: string]: string
}

export type CanvasData = {
  base64: string
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

export const DEFAULT_ITEM: Item = {
  id: 'default_id',
  subject: 'default_subject',
  body: [
    {
      type: 'text',
      content: 'default content',
      id: 'default_content_id',
    },
  ],
  members: [],
}

export type ItemListStore = {
  items: Item[]
  setItems: Setter<Item[]>
  deleteItem: (id: string) => void
  createItem: (item: Partial<Item>) => void

  hoveredItem: string | null
  setHoveredItem: Setter<string | null>

  addContentToItem: (id: string, content: ItemBody) => void
  editItemContent: (id: string, content: ItemBody) => void
  showItemList: boolean
  setShowItemList: Setter<boolean>
}

export const itemListStore: AppStateCreator<ItemListStore> = (set, get) => ({
  items: [],
  setItems: (setter) => stateSetter(set, setter, `items`),
  createItem: (item: Partial<Item>) => {
    produceState(set, (state) => {
      state.items.push({
        ...DEFAULT_ITEM,
        id: nanoid(),
        ...item,
      })
    })
  },
  deleteItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
      connections: state.connections.filter(
        (connection) => connection.id.includes(id) === false,
      ),
      windows: state.windows.filter((window) => window.id !== id),
    }))
  },

  hoveredItem: null,
  setHoveredItem: (setter) => stateSetter(set, setter, `hoveredItem`),
  addContentToItem: (id, content) => {
    produceState(set, (state) => {
      const item = state.items.find((item) => item.id === id)
      if (item) {
        item.body.push(content)
      }
    })
  },

  editItemContent: (id, content) => {
    produceState(set, (state) => {
      const item = state.items.find((item) => item.id === id)
      if (item) {
        const body = item.body.find((body) => body.id === content.id)
        if (body) {
          body.content = content.content
        }
      }
    })
  },

  showItemList: false,
  setShowItemList: (setter) => stateSetter(set, setter, `showItemList`),
})
