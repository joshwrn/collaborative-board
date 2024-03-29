import { create } from 'zustand'
import { connectedWindowsStore, ConnectedWindowsStore } from './connections'
import { contextMenuStore, ContextMenuStore } from './contextMenu'
import { itemListStore, ItemListStore } from './items'
import { memberStore, MemberStore } from './members'
import { mockStore, MockStore } from './mock'
import { peripheralStore, PeripheralStore } from './peripheral'
import { spaceStore, SpaceStore } from './space'
import { userStore, UserStore } from './user'
import { openWindowsStore, OpenWindowsStore } from './windows'

export type AppStore = ConnectedWindowsStore &
  ContextMenuStore &
  ItemListStore &
  MemberStore &
  MockStore &
  PeripheralStore &
  SpaceStore &
  UserStore &
  OpenWindowsStore

export const useAppStore = create<AppStore>((...operators) => {
  return {
    ...connectedWindowsStore(...operators),
    ...contextMenuStore(...operators),
    ...itemListStore(...operators),
    ...memberStore(...operators),
    ...mockStore(...operators),
    ...peripheralStore(...operators),
    ...spaceStore(...operators),
    ...userStore(...operators),
    ...openWindowsStore(...operators),
  }
})
