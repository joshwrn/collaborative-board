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

export const resetPan = (wrapperRef: React.RefObject<HTMLDivElement>) => {
  if (!wrapperRef.current) {
    throw new Error(`wrapperRef.current is null`)
  }
  const wrapper = wrapperRef.current.getBoundingClientRect()
  const x = (SPACE_ATTRS.size - window.innerWidth + wrapper.left) / 2
  const y = (SPACE_ATTRS.size - window.innerHeight + wrapper.top) / 2
  return {
    x: x,
    y: y,
  }
}

export const spaceStore: AppStateCreator<SpaceStore> = (set) => ({
  zoom: 0.25,
  pan: { x: 0, y: 0 },
  setZoom: (setter) => stateSetter(set, setter, `zoom`),
  setPan: (setter) => stateSetter(set, setter, `pan`),
})
