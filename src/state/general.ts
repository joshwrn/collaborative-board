import { Store } from './gen-state'
import { AppStateCreator, produceState } from './state'

export type SavedState = Pick<
  Store,
  'windows' | 'items' | 'zoom' | 'pan' | 'connections' | 'autoSaveEnabled'
>

export type GeneralStore = {
  setState: (setter: (draft: Store) => void) => void
  saveToLocalStorage: () => void
  autoSaveEnabled: boolean
}

export const generalStore: AppStateCreator<GeneralStore> = (set, get) => ({
  setState: (setter: (draft: Store) => void) => {
    produceState(set, setter)
  },
  autoSaveEnabled: true,
  saveToLocalStorage: () => {
    const state = get()
    const savedState: SavedState = {
      windows: state.windows,
      items: state.items,
      connections: state.connections,
      zoom: state.zoom,
      pan: state.pan,
      autoSaveEnabled: state.autoSaveEnabled,
    }
    localStorage.setItem('ai-sketch-app', JSON.stringify(savedState))
  },
})
