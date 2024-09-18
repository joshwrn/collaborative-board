import type { AppStateCreator, Setter } from './state'
import { stateSetter } from './state'

export interface SpaceStore {
  zoom: number
  pan: { x: number; y: number }
  setZoom: Setter<number>
  setPan: Setter<{ x: number; y: number }>
  incrementZoom: (amount?: number) => void
  findSpaceCenterPoint: () => { x: number; y: number }
}

const DEFAULT_ZOOM = 0.5
const DEFAULT_SIZE = 2000000

const DEFAULT_PAN = {
  x: (DEFAULT_SIZE / 2) * DEFAULT_ZOOM,
  y: (DEFAULT_SIZE / 2) * DEFAULT_ZOOM,
}

export const SPACE_ATTRS = {
  size: {
    default: DEFAULT_SIZE,
  },
  pan: {
    default: DEFAULT_PAN,
  },
  zoom: {
    min: 0.1,
    max: 1,
    default: DEFAULT_ZOOM,
  },
}

export const spaceStore: AppStateCreator<SpaceStore> = (set, get) => ({
  zoom: SPACE_ATTRS.zoom.default,
  pan: SPACE_ATTRS.pan.default,
  setZoom: (setter) => stateSetter(set, setter, `zoom`),
  setPan: (setter) => stateSetter(set, setter, `pan`),
  findSpaceCenterPoint: () => {
    const state = get()
    const left = SPACE_ATTRS.size.default / 2 - state.pan.x
    const top = SPACE_ATTRS.size.default / 2 - state.pan.y
    const x = left / state.zoom
    const y = top / state.zoom
    return {
      x: x,
      y: y,
    }
  },
  incrementZoom: (amount = 0.05) => {
    const state = get()
    const center = state.findSpaceCenterPoint()
    const newZoom = state.zoom + amount
    const offset = newZoom - state.zoom
    const offSetX = center.x * offset
    const offSetY = center.y * offset
    state.setZoom(newZoom)
    state.setPan((prev) => ({
      x: prev.x - offSetX,
      y: prev.y - offSetY,
    }))
  },
})
