import { Point2d } from '.'
import { AppStateCreator, Setter, stateSetter } from './state'

export type PeripheralStore = {
  mousePosition: Point2d
  setMousePosition: Setter<Point2d>
  spaceMousePosition: Point2d
  setSpaceMousePosition: Setter<Point2d>
}

export const peripheralStore: AppStateCreator<PeripheralStore> = (set) => ({
  mousePosition: { x: 0, y: 0 },
  setMousePosition: (setter) => stateSetter(set, setter, `mousePosition`),

  spaceMousePosition: { x: 0, y: 0 },
  setSpaceMousePosition: (setter) =>
    stateSetter(set, setter, `spaceMousePosition`),
})
