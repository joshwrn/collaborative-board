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
}

export const canvasStore: AppStateCreator<CanvasStore> = (set, get) => ({
  tool: `draw`,
  drawSize: 50,
  drawColor: `#674dff`,
})
