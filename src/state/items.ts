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
    activatedAt: z.string().nullable(),
    type: z.literal(`generated`),
  }),
])

export type ItemBody = z.infer<typeof itemBodySchema>
export type ItemBodyType = ItemBody[`type`]

export const itemSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: itemBodySchema,
})

export type Item = z.infer<typeof itemSchema>

export type ItemWithSpecificBody<T extends ItemBody[`type`]> = Item & {
  body: Extract<ItemBody, { type: T }>
}

export const DEFAULT_ITEM: Item = {
  id: `default_id`,
  title: `default_title`,
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
  findGeneratedItems: () => ItemWithSpecificBody<`generated`>[]
  findGeneratorItems: () => ItemWithSpecificBody<`generator`>[]
  findParentItem: (id: string) => Item
  hoveredItem: string | null
  editItemContent: <T extends ItemBodyType>(
    id: string,
    content: Partial<Extract<ItemBody, { type: T }>>,
  ) => void
  toggleItemActive: (id: string) => void
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
  findGeneratedItems: () => {
    const state = get()
    return state.items.filter(
      (i) => i.body.type === `generated`,
    ) as ItemWithSpecificBody<`generated`>[]
  },
  findGeneratorItems: () => {
    const state = get()
    return state.items.filter(
      (i) => i.body.type === `generator`,
    ) as ItemWithSpecificBody<`generator`>[]
  },
  findParentItem: (id) => {
    const state = get()
    const item = state.items.find((i) => i.id === id)
    if (!item) {
      throw new Error(`item not found - id: ${id}`)
    }
    const connection = state.connections.find((c) => c.to === id)
    const parentId = connection?.from
    const parent = state.items.find((i) => i.id === parentId)
    if (!parent) {
      throw new Error(`parent not found - id: ${parentId}`)
    }
    return parent
  },
  toggleItemActive: (id) => {
    const state = get()
    const item = state.findGeneratedItems().find((i) => i.id === id)
    if (!item) {
      throw new Error(`item not found - id: ${id}`)
    }
    const connection = state.connections.find((c) => c.to === id)
    const relatedConnections = state.connections
      .filter((c) => c.from === connection?.from)
      .map((c) => c.to)
    // activate
    if (!item.body.activatedAt) {
      const prevActivatedItem = state
        .findGeneratedItems()
        .find((i) => relatedConnections.includes(i.id) && i.body.activatedAt)
      if (prevActivatedItem) {
        state.editItemContent(prevActivatedItem.id, {
          activatedAt: null,
        })
      }
      state.editItemContent(id, {
        activatedAt: new Date().toISOString(),
      })
    }
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
