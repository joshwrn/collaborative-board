import type { Point2d } from '.'
import { SPACE_ATTRS } from './space'
import type { AppStateCreator, Setter } from './state'
import { stateSetter } from './state'

export interface PeripheralStore {
  mousePosition: Point2d
  setMousePosition: Setter<Point2d>
  spaceMousePosition: Point2d
  updateSpaceMousePosition: (mousePosition: Point2d) => void
}

export const peripheralStore: AppStateCreator<PeripheralStore> = (set, get) => ({
  mousePosition: { x: 0, y: 0 },
  setMousePosition: (setter) => stateSetter(set, setter, `mousePosition`),

  spaceMousePosition: { x: 0, y: 0 },
  updateSpaceMousePosition: (mousePosition) => {
    const state = get()
    const left = SPACE_ATTRS.size.default / 2 - state.pan.x
    const top = SPACE_ATTRS.size.default / 2 - state.pan.y
    const x = left
    const y = top
    const distFromCenterX = window.innerWidth / 2 - mousePosition.x
    const distFromCenterY = window.innerHeight / 2 - mousePosition.y
    // 5 = (padding / 2). 22 = (toolbar height / 2)
    const x2 = x - distFromCenterX + 5
    const y2 = y - distFromCenterY - 22
    const spaceMousePosition = {
      x: x2 / state.zoom,
      y: y2 / state.zoom,
    }
    state.setState((draft) => {
      draft.spaceMousePosition = spaceMousePosition
    })
  },
})
