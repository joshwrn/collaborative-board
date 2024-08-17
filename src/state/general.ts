import { ensureAllFieldsDefined } from '@/utils/ensureAllFieldsDefined'

import type { Store } from './gen-state'
import type { AppStateCreator } from './state'
import { produceState } from './state'

export type SavedState = Pick<Store, `connections` | `items` | `windows`>

export interface GeneralStore {
  setState: (setter: (draft: Store) => void) => void
  importState: (savedState: File | null, notificationId: string) => void
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
    }
    const blob = new Blob([JSON.stringify(savedState)], {
      type: `application/json`,
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement(`a`)
    link.href = url
    link.download = `ai-sketch-app-${new Date().toISOString()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  },
  importState: (saveFile, notificationId) => {
    const state = get()
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const savedState = JSON.parse(e.target?.result as string)
        const saveObject = ensureAllFieldsDefined({
          windows: savedState.windows,
          items: savedState.items,
          connections: savedState.connections,
        })
        produceState(set, (draft) => {
          draft.windows = saveObject.windows
          draft.items = saveObject.items
          draft.connections = saveObject.connections
        })
      } catch (error) {
        console.error(error)
        state.updateNotification(notificationId, {
          message: `Failed to import file`,
          type: `error`,
        })
      }
    }

    if (!saveFile) {
      throw new Error(`No file selected`)
    }
    reader.readAsText(saveFile)
  },
})
