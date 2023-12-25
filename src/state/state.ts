import type { Mutate, StoreApi, StoreMutatorIdentifier } from 'zustand'
import { create } from 'zustand'
import {
  EmailListStore,
  OpenEmailsStore,
  emailListStore,
  openEmailsStore,
} from './emails'
import { SpaceStore, spaceStore } from '@/gestures'
import { UserStore, userStore } from './user'

export type AppStore = EmailListStore & OpenEmailsStore & SpaceStore & UserStore

export const useAppStore = create<AppStore>((...operators) => {
  // const stores = [emailListStore, openEmailsStore, spaceStore, userStore]

  // return Object.assign({}, ...stores.map((store) => store(...operators)))
  return {
    ...emailListStore(...operators),
    ...openEmailsStore(...operators),
    ...spaceStore(...operators),
    ...userStore(...operators),
  }
})

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
  setter: StateCallback<AppStore[T]>,
  key: T,
) => {
  set((state) => {
    if (!key || !state.hasOwnProperty(key)) {
      return state
    }
    if (setter instanceof Function) {
      return {
        [key]: setter(state[key]),
      }
    }
    return {
      [key]: setter,
    }
  })
}
