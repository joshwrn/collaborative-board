import { z } from 'zod'

import { formatDateForFileName } from '@/utils/formatDateForFileName'

import { connectionSchema } from './connections'
import { falSettingsNodeSchema } from './fal'
import type { Store } from './gen-state'
import { itemSchema } from './items'
import type { AppStateCreator } from './state'
import { produceState } from './state'
import { windowSchema } from './windows'

export const saveStateSchema = z.object({
  windows: z.array(windowSchema),
  items: z.array(itemSchema),
  itemConnections: z.array(connectionSchema),
  falSettingsConnections: z.array(connectionSchema),
  falSettingsNodes: z.array(falSettingsNodeSchema),
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
      itemConnections: state.itemConnections,
      falSettingsConnections: state.falSettingsConnections,
      falSettingsNodes: state.falSettingsNodes,
    }
    const blob = new Blob([JSON.stringify(savedState)], {
      type: `application/json`,
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement(`a`)
    link.href = url
    link.download = `ai_sketch_app__${formatDateForFileName()}.json`
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
          draft.itemConnections = saveObject.itemConnections
          draft.falSettingsConnections = saveObject.falSettingsConnections
          draft.falSettingsNodes = saveObject.falSettingsNodes
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
