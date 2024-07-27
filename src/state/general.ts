import { AppStore } from './gen-state'
import { AppStateCreator, produceState } from './state'

export type GeneralStore = {
  setState: (setter: (draft: AppStore) => void) => void
}

export const generalStore: AppStateCreator<GeneralStore> = (set, get) => ({
  setState: (setter: (draft: AppStore) => void) => {
    produceState(set, setter)
  },
})
