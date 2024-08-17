import { produce } from 'immer'
import type { Mutate, StoreApi, StoreMutatorIdentifier } from 'zustand'

import type { Store } from './gen-state'

type Get<T, K, F> = K extends keyof T ? T[K] : F
export type AppStateCreator<
  T,
  Mis extends [StoreMutatorIdentifier, unknown][] = [],
  Mos extends [StoreMutatorIdentifier, unknown][] = [],
  U = T,
> = ((
  setState: Get<Mutate<StoreApi<Store>, Mis>, `setState`, never>,
  getState: Get<Mutate<StoreApi<Store>, Mis>, `getState`, never>,
  store: Mutate<StoreApi<T>, Mis>,
) => U) & {
  $$storeMutators?: Mos
}

export type StateCallback<T> = T | ((prev: T) => T)
// uncomment this to get type errors
// export type StateSetter<T> = (callback: StateCallback<T>) => void

export type Setter<T> = (callback: StateCallback<T>) => void

export const stateSetter = <T extends keyof Store>(
  set: Set,
  newValue: StateCallback<Store[T]>,
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

export type Set = (
  partial: Partial<Store> | Store | ((state: Store) => Partial<Store> | Store),
  replace?: boolean | undefined,
) => void

export const produceState = (set: Set, newState: (draft: Store) => void) => {
  return set(produce<Store>(newState))
}
