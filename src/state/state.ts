import type { Mutate, StoreApi, StoreMutatorIdentifier } from 'zustand'
import { create } from 'zustand'
import { EmailListStore, emailListStore } from './emails'
import { UserStore, userStore } from './user'
import { SpaceStore, spaceStore } from './space'
import { OpenWindowsStore, openWindowsStore } from './windows'
import { mountStoreDevtool } from 'simple-zustand-devtools'
import { ConnectedWindowsStore, connectedWindowsStore } from './connections'

export type AppStore = EmailListStore &
  OpenWindowsStore &
  SpaceStore &
  ConnectedWindowsStore &
  UserStore

export const useAppStore = create<AppStore>((...operators) => {
  // const stores = [emailListStore, openEmailsStore, spaceStore, userStore]
  // return Object.assign({}, ...stores.map((store) => store(...operators)))
  return {
    ...emailListStore(...operators),
    ...openWindowsStore(...operators),
    ...spaceStore(...operators),
    ...connectedWindowsStore(...operators),
    ...userStore(...operators),
  }
})
if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('appStore', useAppStore)
}

type Get<T, K, F> = K extends keyof T ? T[K] : F
export type AppStateCreator<
  T,
  Mis extends [StoreMutatorIdentifier, unknown][] = [],
  Mos extends [StoreMutatorIdentifier, unknown][] = [],
  U = T,
> = ((
  setState: Get<Mutate<StoreApi<AppStore>, Mis>, `setState`, never>,
  getState: Get<Mutate<StoreApi<AppStore>, Mis>, `getState`, never>,
  store: Mutate<StoreApi<T>, Mis>,
) => U) & {
  $$storeMutators?: Mos
}

export type StateCallback<T> = ((prev: T) => T) | T
// uncomment this to get type errors
// export type StateSetter<T> = (callback: StateCallback<T>) => void

export type Setter<T> = (callback: StateCallback<T>) => void

export const stateSetter = <T extends keyof AppStore>(
  set: (
    partial:
      | AppStore
      | Partial<AppStore>
      | ((state: AppStore) => AppStore | Partial<AppStore>),
    replace?: boolean | undefined,
  ) => void,
  newValue: StateCallback<AppStore[T]>,
  key: T,
) => {
  set((state) => {
    if (!key || !state.hasOwnProperty(key)) {
      throw new Error(`state.${key} does not exist`)
    }
    if (newValue instanceof Function) {
      return {
        // @ts-expect-error - expects two arguments
        [key]: newValue(state[key]),
      }
    }
    return {
      [key]: newValue,
    }
  })
}
