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

export type AppStore = CanvasStore &
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

export const useAppStore = create<AppStore>((...operators) => {
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
})
export const useShallowAppStore = (selected: (keyof AppStore)[]) => {
  return useAppStore(
    useShallow((state: AppStore) => {
      return {
        ...selected.reduce((acc, key) => {
          // @ts-expect-error
          acc[key as keyof AppStore] = state[key]
          return acc
        }, {} as { [key in keyof AppStore]: AppStore[key] }),
      }
    }),
  )
}
