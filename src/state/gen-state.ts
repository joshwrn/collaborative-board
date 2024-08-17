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
import type { MemberStore } from './members'
import { memberStore } from './members'
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
  MemberStore &
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
    ...memberStore(set, get, store),
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
export const useStore = <T extends keyof Store>(selected: T[]) => {
  return useFullStore(
    useShallow((state: Store) => {
      return selected.reduce(
        (acc, key) => {
          acc[key] = state[key]
          return acc
        },
        {} as Pick<Store, T>,
      )
    }),
  )
}
