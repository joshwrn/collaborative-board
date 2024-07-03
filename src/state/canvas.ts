import { AppStateCreator, Setter, stateSetter } from './state'

export type CanvasStore = {
  tool: 'draw'
  setTool: Setter<'draw'>
  color: string
  setColor: Setter<string>
}

export const canvasStore: AppStateCreator<CanvasStore> = (set, get) => ({
  tool: 'draw',
  setTool: (setter) => stateSetter(set, setter, `tool`),
  color: '#ff0000',
  setColor: (setter) => stateSetter(set, setter, `color`),
})
