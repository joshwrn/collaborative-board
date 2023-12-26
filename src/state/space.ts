import { AppStateCreator, Setter, stateSetter } from './state'

export type SpaceStore = {
  zoom: number
  pan: { x: number; y: number }
  setZoom: Setter<number>
  setPan: Setter<{ x: number; y: number }>
}

export const SPACE_ATTRS = {
  size: 5000,
}

export const spaceStore: AppStateCreator<SpaceStore> = (set) => ({
  zoom: 1,
  pan: { x: 0, y: 0 },
  setZoom: (setter) => stateSetter(set, setter, `zoom`),
  setPan: (setter) => stateSetter(set, setter, `pan`),
})
