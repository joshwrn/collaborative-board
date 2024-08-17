import type { AppStateCreator, Setter } from './state'
import { stateSetter } from './state'

export interface SpaceStore {
  zoom: number
  pan: { x: number; y: number }
  setZoom: Setter<number>
  setPan: Setter<{ x: number; y: number }>
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

export const spaceStore: AppStateCreator<SpaceStore> = (set) => ({
  zoom: SPACE_ATTRS.zoom.default,
  pan: SPACE_ATTRS.pan.default,
  setZoom: (setter) => stateSetter(set, setter, `zoom`),
  setPan: (setter) => stateSetter(set, setter, `pan`),
})
