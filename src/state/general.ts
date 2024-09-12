import { z } from 'zod'

import { connectionSchema } from './connections'
import type { Store } from './gen-state'
import { itemSchema } from './items'
import type { AppStateCreator } from './state'
import { produceState } from './state'
import { windowSchema } from './windows'

export const saveStateSchema = z.object({
  windows: z.array(windowSchema),
  items: z.array(itemSchema),
  connections: z.array(connectionSchema),
})

export type SavedState = z.infer<typeof saveStateSchema>

export interface GeneralStore {
  setState: (setter: (draft: Store) => void) => void
  importState: (savedState: File | null, notificationId: string) => void
  exportState: () => void
  showImportModal: boolean
  showAboutModal: boolean
  showTutorialModal: boolean
}

export const generalStore: AppStateCreator<GeneralStore> = (set, get) => ({
  setState: (setter: (draft: Store) => void) => {
    produceState(set, setter)
  },
  showAboutModal: false,
  showImportModal: false,
  showTutorialModal: (() => {
    if (typeof localStorage === `undefined`) {
      return false
    }
    const hasSeenTutorialExists = localStorage.getItem(
      `scribble-ai-hasSeenTutorial`,
    )
    if (hasSeenTutorialExists) {
      const hasSeenTutorial = JSON.parse(hasSeenTutorialExists)
      return hasSeenTutorial ? false : true
    }
    localStorage.setItem(`scribble-ai-hasSeenTutorial`, `true`)
    return true
  })(),
  exportState: () => {
    const state = get()
    const savedState: SavedState = {
      windows: state.windows,
      items: state.items,
      connections: state.itemConnections,
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
        const saveObject = saveStateSchema.parse(savedState)
        produceState(set, (draft) => {
          draft.windows = saveObject.windows
          draft.items = saveObject.items
          draft.itemConnections = saveObject.connections
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
