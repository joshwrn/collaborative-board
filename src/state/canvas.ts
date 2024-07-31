import { AppStateCreator, Setter, stateSetter } from './state'

export type GeneratedCanvas = {
  canvasId: string
  itemId: string
  generatedFromItemId: string
}

export type CanvasStore = {
  tool: 'draw'
  setTool: Setter<'draw'>
  drawColor: string
  setDrawColor: Setter<string>
  drawSize: number
  setDrawSize: Setter<number>
  canvasIsFocused: boolean
  setCanvasIsFocused: Setter<boolean>
  generatedCanvas: GeneratedCanvas | null
  setGeneratedCanvas: Setter<GeneratedCanvas | null>
  generatingCanvas: string[]
  setGeneratingCanvas: Setter<string[]>
}

export const canvasStore: AppStateCreator<CanvasStore> = (set, get) => ({
  tool: 'draw',
  setTool: (setter) => stateSetter(set, setter, `tool`),
  drawSize: 10,
  setDrawSize: (setter) => stateSetter(set, setter, `drawSize`),
  drawColor: '#ff0000',
  setDrawColor: (setter) => stateSetter(set, setter, `drawColor`),
  canvasIsFocused: false,
  setCanvasIsFocused: (setter) => stateSetter(set, setter, `canvasIsFocused`),
  generatedCanvas: null,
  setGeneratedCanvas: (setter) => stateSetter(set, setter, `generatedCanvas`),
  generatingCanvas: [],
  setGeneratingCanvas: (setter) => stateSetter(set, setter, `generatingCanvas`),
})
