import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

import type { CanvasStore } from './canvas'
import { canvasStore } from './canvas'
import type { ConnectedWindowsStore } from './connections'
import { connectedWindowsStore } from './connections'
import type { ContextMenuStore } from './contextMenu'
import { contextMenuStore } from './contextMenu'
import type { DebugStore } from './debug'
import { debugStore } from './debug'
import type { FalStore } from './fal'
import { falStore } from './fal'
import type { GeneralStore } from './general'
import { generalStore } from './general'
import type { ItemListStore } from './items'
import { itemListStore } from './items'
import type { MockStore } from './mock'
import { mockStore } from './mock'
import type { NotificationsStore } from './notifications'
import { notificationsStore } from './notifications'
import type { PeripheralStore } from './peripheral'
import { peripheralStore } from './peripheral'
import type { SnappingStore } from './snapping'
import { snappingStore } from './snapping'
import type { SpaceStore } from './space'
import { spaceStore } from './space'
import type { UiStore } from './ui'
import { uiStore } from './ui'
import type { UserStore } from './user'
import { userStore } from './user'
import type { OpenWindowsStore } from './windows'
import { openWindowsStore } from './windows'

export type Store = CanvasStore &
  ConnectedWindowsStore &
  ContextMenuStore &
  DebugStore &
  FalStore &
  GeneralStore &
  ItemListStore &
  MockStore &
  NotificationsStore &
  OpenWindowsStore &
  PeripheralStore &
  SnappingStore &
  SpaceStore &
  UiStore &
  UserStore

export const useFullStore = create<Store>((set, get, store) => {
  return {
    ...canvasStore(set, get, store),
    ...connectedWindowsStore(set, get, store),
    ...contextMenuStore(set, get, store),
    ...debugStore(set, get, store),
    ...falStore(set, get, store),
    ...generalStore(set, get, store),
    ...itemListStore(set, get, store),
    ...mockStore(set, get, store),
    ...notificationsStore(set, get, store),
    ...peripheralStore(set, get, store),
    ...snappingStore(set, get, store),
    ...spaceStore(set, get, store),
    ...uiStore(set, get, store),
    ...userStore(set, get, store),
    ...openWindowsStore(set, get, store),
  }
})
export const useStore = <
  TSelectors extends Record<string, unknown> = {},
  TState extends readonly (keyof Store)[] | undefined = undefined,
>(
  input1: TState | ((state: Store) => TSelectors),
  input2?: TState | ((state: Store) => TSelectors),
): TSelectors &
  (TState extends undefined
    ? TSelectors
    : Pick<Store, NonNullable<TState>[number]>) => {
  return useFullStore(
    useShallow((state: Store) => {
      let s1: Partial<Pick<Store, NonNullable<TState>[number]>> | TSelectors = {}
      let s2: Partial<Pick<Store, NonNullable<TState>[number]>> | TSelectors = {}

      // Handling input1
      if (typeof input1 === `function`) {
        s1 = (input1 as (state: Store) => TSelectors)(state)
      } else if (Array.isArray(input1)) {
        s1 = input1.reduce(
          (acc, key) => {
            // @ts-expect-error
            acc[key] = state[key]
            return acc
          },
          {} as Partial<Pick<Store, NonNullable<TState>[number]>>,
        )
      }

      // Handling input2
      if (typeof input2 === `function`) {
        s2 = (input2 as (state: Store) => TSelectors)(state)
      } else if (Array.isArray(input2)) {
        s2 = input2.reduce(
          (acc, key) => {
            // @ts-expect-error
            acc[key] = state[key]
            return acc
          },
          {} as Partial<Pick<Store, NonNullable<TState>[number]>>,
        )
      }

      return {
        ...s1,
        ...s2,
      } as TSelectors &
        (TState extends undefined
          ? TSelectors
          : Pick<Store, NonNullable<TState>[number]>)
    }),
  )
}
