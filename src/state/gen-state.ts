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
import { peripheralStore, PeripheralStore } from './peripheral'
import { snappingStore, SnappingStore } from './snapping'
import { spaceStore, SpaceStore } from './space'
import { userStore, UserStore } from './user'
import { openWindowsStore, OpenWindowsStore } from './windows'
import { devtools, persist } from 'zustand/middleware'

export type Store = CanvasStore &
  ConnectedWindowsStore &
  ContextMenuStore &
  DebugStore &
  GeneralStore &
  ItemListStore &
  MemberStore &
  MockStore &
  PeripheralStore &
  SnappingStore &
  SpaceStore &
  UserStore &
  OpenWindowsStore

export const useFullStore = create<Store>()(
  devtools(
    persist(
      (...operators) => {
        return {
          ...canvasStore(...operators),
          ...connectedWindowsStore(...operators),
          ...contextMenuStore(...operators),
          ...debugStore(...operators),
          ...generalStore(...operators),
          ...itemListStore(...operators),
          ...memberStore(...operators),
          ...mockStore(...operators),
          ...peripheralStore(...operators),
          ...snappingStore(...operators),
          ...spaceStore(...operators),
          ...userStore(...operators),
          ...openWindowsStore(...operators),
        }
      },
      { name: 'app-store' },
    ),
  ),
)
export const useStore = <T extends keyof Store>(selected: T[]) => {
  return useFullStore(
    useShallow((state: Store) => {
      return selected.reduce((acc, key) => {
        acc[key] = state[key]
        return acc
      }, {} as Pick<Store, T>)
    }),
  )
}

// type StateObject<T extends Partial<AppStore>> = {
//   [key in keyof T]: T[key]
// }

// export const useShallowAppStore_dep = <T extends Partial<AppStore>>(
//   selected: (state: AppStore) => StateObject<T>,
// ) => {
//   return useAppStore(
//     useShallow((state: AppStore) => {
//       return selected(state) as StateObject<T>
//     }),
//   )
// }
