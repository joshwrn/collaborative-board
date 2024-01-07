import { Point2d } from '.'
import { AppStateCreator, Setter, stateSetter } from './state'

export type PeripheralStore = {
  mousePosition: Point2d
  setMousePosition: Setter<Point2d>
}

export const peripheralStore: AppStateCreator<PeripheralStore> = (set) => ({
  mousePosition: { x: 0, y: 0 },
  setMousePosition: (setter) => stateSetter(set, setter, `mousePosition`),
})
