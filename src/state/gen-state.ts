import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { canvasStore, CanvasStore } from './canvas'
import { connectedWindowsStore, ConnectedWindowsStore } from './connections'
import { contextMenuStore, ContextMenuStore } from './contextMenu'
import { debugStore, DebugStore } from './debug'
import { generalStore, GeneralStore } from './general'
import { itemListStore, ItemListStore } from './items'
import { memberStore, MemberStore } from './members'
import { mockStore, MockStore } from './mock'
import { notificationsStore, NotificationsStore } from './notifications'
import { peripheralStore, PeripheralStore } from './peripheral'
import { snappingStore, SnappingStore } from './snapping'
import { spaceStore, SpaceStore } from './space'
import { userStore, UserStore } from './user'
import { openWindowsStore, OpenWindowsStore } from './windows'

export type Store = CanvasStore &
  ConnectedWindowsStore &
  ContextMenuStore &
  DebugStore &
  GeneralStore &
  ItemListStore &
  MemberStore &
  MockStore &
  NotificationsStore &
  PeripheralStore &
  SnappingStore &
  SpaceStore &
  UserStore &
  OpenWindowsStore

export const useFullStore = create<Store>((set, get, store) => {
  return {
    ...canvasStore(set, get, store),
    ...connectedWindowsStore(set, get, store),
    ...contextMenuStore(set, get, store),
    ...debugStore(set, get, store),
    ...generalStore(set, get, store),
    ...itemListStore(set, get, store),
    ...memberStore(set, get, store),
    ...mockStore(set, get, store),
    ...notificationsStore(set, get, store),
    ...peripheralStore(set, get, store),
    ...snappingStore(set, get, store),
    ...spaceStore(set, get, store),
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
