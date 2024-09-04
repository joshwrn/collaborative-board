import { nanoid } from 'nanoid'
import { z } from 'zod'

import type { AppStateCreator } from './state'
import { produceState } from './state'

const itemBodySchema = z.union([
  z.object({
    prompt: z.string(),
    base64: z.string(),
    type: z.literal(`generator`),
  }),
  z.object({
    modifier: z.string(),
    base64: z.string(),
    type: z.literal(`generated`),
  }),
])

export type ItemBody = z.infer<typeof itemBodySchema>
export type ItemBodyType = ItemBody[`type`]

export const itemSchema = z.object({
  id: z.string(),
  subject: z.string(),
  body: itemBodySchema,
})

export type Item = z.infer<typeof itemSchema>

export type ItemWithSpecificBody<T extends ItemBody[`type`]> = Item & {
  body: Extract<ItemBody, { type: T }>
}

export const DEFAULT_ITEM: Item = {
  id: `default_id`,
  subject: `default_subject`,
  body: {
    prompt: `default_prompt`,
    base64: `default_base64`,
    type: `generator`,
  },
}

export interface ItemListStore {
  items: Item[]
  editItem: (id: string, content: Partial<Omit<Item, `body`>>) => void
  deleteItem: (id: string) => void
  createItem: (item: Partial<Item>) => void

  hoveredItem: string | null

  // addContentToItem: (id: string, content: ItemBody | ItemBody[]) => void
  editItemContent: <T extends ItemBodyType>(
    id: string,
    content: Partial<Extract<ItemBody, { type: T }>>,
  ) => void
  showItemList: boolean
}

export const itemListStore: AppStateCreator<ItemListStore> = (set, get) => ({
  items: [],
  editItem: (id, content) => {
    produceState(set, (state) => {
      const item = state.items.find((curItem) => curItem.id === id)
      if (item) {
        Object.assign(item, content)
      }
    })
  },
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
        (connection) => !connection.id.includes(id),
      ),
      windows: state.windows.filter((window) => window.id !== id),
    }))
  },

  hoveredItem: null,

  editItemContent: (id, content) => {
    produceState(set, (state) => {
      const item = state.items.find((curItem) => curItem.id === id)
      if (item) {
        item.body = {
          ...item.body,
          ...content,
        }
      }
    })
  },

  showItemList: false,
})
