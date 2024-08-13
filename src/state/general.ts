import { Store } from './gen-state'
import { AppStateCreator, produceState } from './state'

export type SavedState = Pick<
  Store,
  'windows' | 'items' | 'zoom' | 'pan' | 'connections'
>

export type GeneralStore = {
  setState: (setter: (draft: Store) => void) => void
  importState: (savedState: File | null) => void
  exportState: () => void
  showImportModal: boolean
}

export const generalStore: AppStateCreator<GeneralStore> = (set, get) => ({
  setState: (setter: (draft: Store) => void) => {
    produceState(set, setter)
  },
  showImportModal: false,
  exportState: () => {
    const state = get()
    const savedState: SavedState = {
      windows: state.windows,
      items: state.items,
      connections: state.connections,
      zoom: state.zoom,
      pan: state.pan,
    }
    const blob = new Blob([JSON.stringify(savedState)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ai-sketch-app-${new Date().toISOString()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  },
  importState: (saveFile) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const savedState = JSON.parse(e.target?.result as string)
      produceState(set, (draft) => {
        draft.windows = savedState.windows
        draft.items = savedState.items
        draft.connections = savedState.connections
        draft.zoom = savedState.zoom
        draft.pan = savedState.pan
      })
    }
    if (!saveFile) {
      throw new Error('No file selected')
    }
    reader.readAsText(saveFile)
  },
})
