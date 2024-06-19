import { AppStateCreator, Setter, stateSetter } from './state'

export type SpaceStore = {
  zoom: number
  pan: { x: number; y: number }
  setZoom: Setter<number>
  setPan: Setter<{ x: number; y: number }>
}

export const SPACE_ATTRS = {
  size: 5000,
  default: {
    zoom: 0.5,
    pan: { x: 2190, y: 2035 },
  },
}

export const resetPan = (wrapperRef: React.RefObject<HTMLDivElement>) => {
  if (!wrapperRef.current) {
    throw new Error(`wrapperRef.current is null`)
  }
  const wrapper = wrapperRef.current.getBoundingClientRect()
  const x = (SPACE_ATTRS.size - window.innerWidth + wrapper.left + 725) / 2
  const y = (SPACE_ATTRS.size - window.innerHeight + wrapper.top) / 2
  return {
    x: x,
    y: y,
  }
}

export const spaceStore: AppStateCreator<SpaceStore> = (set) => ({
  zoom: SPACE_ATTRS.default.zoom,
  pan: SPACE_ATTRS.default.pan,
  setZoom: (setter) => stateSetter(set, setter, `zoom`),
  setPan: (setter) => stateSetter(set, setter, `pan`),
})
