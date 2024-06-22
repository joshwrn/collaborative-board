import { atom, computed } from 'signia'
import { Point2d } from '@/state'

export class SpaceStore {
  private readonly panState = atom<Point2d>('Store.pan', { x: 0, y: 0 })
  private readonly zoomState = atom<number>('Store.zoom', 1)

  @computed get pan() {
    return this.panState.value
  }

  @computed get zoom() {
    return this.zoomState.value
  }

  setPan = (position: Point2d) => {
    this.panState.update(() => position)
  }

  setZoom = (zoom: number) => {
    this.zoomState.update(() => zoom)
  }
}
