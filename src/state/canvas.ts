import { AppStateCreator, Setter, stateSetter } from './state'

export type CanvasStore = {
  tool: 'draw'
  setTool: Setter<'draw'>
  drawColor: string
  setDrawColor: Setter<string>
}

export const canvasStore: AppStateCreator<CanvasStore> = (set, get) => ({
  tool: 'draw',
  setTool: (setter) => stateSetter(set, setter, `tool`),
  drawColor: '#ff0000',
  setDrawColor: (setter) => stateSetter(set, setter, `drawColor`),
})
