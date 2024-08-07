import { AppStateCreator, produceState } from './state'

export type GeneratedCanvas = {
  canvasId: string
  itemId: string
  generatedFromItemId: string
}

export type CanvasStore = {
  tool: 'draw'
  drawColor: string
  drawSize: number
  canvasIsFocused: boolean
  generatedCanvas: GeneratedCanvas | null
  generatingCanvas: {
    itemId: string
    progress: number
  }[]
  updateGeneratingCanvasProgress: (itemId: string, progress: number) => void
  removeGeneratingCanvasItem: (itemId: string) => void
}

export const canvasStore: AppStateCreator<CanvasStore> = (set, get) => ({
  tool: 'draw',
  drawSize: 10,
  drawColor: '#ff0000',
  canvasIsFocused: false,
  generatedCanvas: null,
  generatingCanvas: [],
  updateGeneratingCanvasProgress: (itemId: string, progress: number) => {
    produceState(set, (draft) => {
      draft.generatingCanvas = draft.generatingCanvas.map((i) => {
        if (i.itemId === itemId) {
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
        (i) => i.itemId !== itemId,
      )
    })
  },
})
