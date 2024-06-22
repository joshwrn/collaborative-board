import { atom, computed } from 'signia'
import { Point2d } from '@/state'

export class Peripheral {
  private readonly mousePositionState = atom<Point2d>('Store.mousePosition', {
    x: 0,
    y: 0,
  })

  @computed get mousePosition() {
    return this.mousePositionState.value
  }

  setMousePosition = (position: Point2d) => {
    this.mousePositionState.update((pos) => position)
  }
}
