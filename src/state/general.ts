import { Store } from './gen-state'
import { AppStateCreator, produceState } from './state'

export type GeneralStore = {
  setState: (setter: (draft: Store) => void) => void
}

export const generalStore: AppStateCreator<GeneralStore> = (set, get) => ({
  setState: (setter: (draft: Store) => void) => {
    produceState(set, setter)
  },
})
