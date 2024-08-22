import type { AppStateCreator } from './state'
import { produceState } from './state'

export interface GeneratedCanvas {
  canvasId: string
  itemId: string
  generatedFromItemId: string
}

export interface CanvasStore {
  tool: `draw`
  drawColor: string
  drawSize: number
  generatedCanvas: GeneratedCanvas | null
  generatingCanvas: {
    newItemId: string
    generatedFromItemId: string
    progress: number
  }[]
  updateGeneratingCanvasProgress: (itemId: string, progress: number) => void
  removeGeneratingCanvasItem: (itemId: string) => void
}

export const canvasStore: AppStateCreator<CanvasStore> = (set, get) => ({
  tool: `draw`,
  drawSize: 50,
  drawColor: `#0070f3`,
  generatedCanvas: null,
  generatingCanvas: [],
  updateGeneratingCanvasProgress: (itemId: string, progress: number) => {
    produceState(set, (draft) => {
      draft.generatingCanvas = draft.generatingCanvas.map((i) => {
        if (i.newItemId === itemId) {
          return {
            ...i,
            progress,
          }
        }
        return i
      })
    })
  },
  removeGeneratingCanvasItem: (itemId: string) => {
    produceState(set, (draft) => {
      draft.generatingCanvas = draft.generatingCanvas.filter(
        (i) => i.newItemId !== itemId,
      )
    })
  },
})
