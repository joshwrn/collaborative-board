import { AppStateCreator } from './state'

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
  generatingCanvas: string[]
}

export const canvasStore: AppStateCreator<CanvasStore> = (set, get) => ({
  tool: 'draw',
  drawSize: 10,
  drawColor: '#ff0000',
  canvasIsFocused: false,
  generatedCanvas: null,
  generatingCanvas: [],
})
