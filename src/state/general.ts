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
  importState: (savedState: File | null) => void
  exportState: () => void
  showImportModal: boolean
}

const returnTimeAndDate = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const formatted = `${month}-${day}-${year}-${hours}-${minutes}-${seconds}`
  return formatted
}

export const generalStore: AppStateCreator<GeneralStore> = (set, get) => ({
  setState: (setter: (draft: Store) => void) => {
    produceState(set, setter)
  },
  showImportModal: false,
  autoSaveEnabled: true,
  exportState: () => {
    const state = get()
    const savedState: SavedState = {
      windows: state.windows,
      items: state.items,
      connections: state.connections,
      zoom: state.zoom,
      pan: state.pan,
      autoSaveEnabled: state.autoSaveEnabled,
    }
    console.log('exporting', savedState)
    const blob = new Blob([JSON.stringify(savedState)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ai-sketch-app-${returnTimeAndDate()}.json`
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
        draft.autoSaveEnabled = savedState.autoSaveEnabled
      })
    }
    if (!saveFile) {
      throw new Error('No file selected')
    }
    reader.readAsText(saveFile)
  },
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
    console.log('saving', savedState)
    localStorage.setItem('ai-sketch-app', JSON.stringify(savedState))
  },
})
