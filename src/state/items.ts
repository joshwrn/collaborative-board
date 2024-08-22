import { nanoid } from 'nanoid'
import { z } from 'zod'

import type { AppStateCreator } from './state'
import { produceState } from './state'

export interface Iframe {
  [key: string]: string
  src: string
}

export interface CanvasData {
  base64: string
}

const itemBodySchema = z.union([
  z.object({
    content: z.string(),
    id: z.string(),
    type: z.literal(`text`),
  }),
  z.object({
    content: z.object({
      base64: z.string(),
    }),
    id: z.string(),
    type: z.literal(`canvas`),
  }),
  z.object({
    content: z.object({
      src: z.string(),
    }),
    id: z.string(),
    type: z.literal(`iframe`),
  }),
])

export type ItemBody = z.infer<typeof itemBodySchema>

export const itemSchema = z.object({
  id: z.string(),
  subject: z.string(),
  body: z.array(itemBodySchema),
  members: z.array(z.string()),
})

export const ItemBodyTypes = [`text`, `iframe`, `canvas`] as const
export type ItemBodyType = (typeof ItemBodyTypes)[number]

export interface ItemBodyText {
  content: string
  id: string
  type: `text`
}

export interface Item {
  id: string
  subject: string
  body: ItemBody[]
  members: string[]
}

export const DEFAULT_ITEM: Item = {
  id: `default_id`,
  subject: `default_subject`,
  body: [],
  members: [],
}

export interface ItemListStore {
  items: Item[]
  editItem: (id: string, content: Partial<Omit<Item, `body`>>) => void
  deleteItem: (id: string) => void
  createItem: (item: Partial<Item>) => void

  hoveredItem: string | null

  addContentToItem: (id: string, content: ItemBody | ItemBody[]) => void
  editItemContent: (id: string, content: ItemBody) => void
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
  addContentToItem: (id, content) => {
    produceState(set, (state) => {
      const item = state.items.find((curItem) => curItem.id === id)
      if (item) {
        if (Array.isArray(content)) {
          item.body.push(...content)
        } else {
          item.body.push(content)
        }
      }
    })
  },

  editItemContent: (id, content) => {
    produceState(set, (state) => {
      const item = state.items.find((curItem) => curItem.id === id)
      if (item) {
        const body = item.body.find((curBody) => curBody.id === content.id)
        if (body) {
          body.content = content.content
        }
      }
    })
  },

  showItemList: false,
})
