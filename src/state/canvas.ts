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
  loadingCanvases: {
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
  drawColor: `#674dff`,
  generatedCanvas: null,
  loadingCanvases: [],
  updateGeneratingCanvasProgress: (itemId: string, progress: number) => {
    produceState(set, (draft) => {
      draft.loadingCanvases = draft.loadingCanvases.map((i) => {
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
      draft.loadingCanvases = draft.loadingCanvases.filter(
        (i) => i.newItemId !== itemId,
      )
    })
  },
})
