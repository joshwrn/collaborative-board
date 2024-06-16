import { Point2d } from '.'
import { AppStateCreator, Setter, stateSetter } from './state'

export type ElementTypes = 'connections' | 'item'

export type DebugStore = {
  debug_zoomFocusPoint: Point2d
  debug_setZoomFocusPoint: Setter<Point2d>
}

export const debugStore: AppStateCreator<DebugStore> = (set, get) => ({
  debug_zoomFocusPoint: { x: 0, y: 0 },
  debug_setZoomFocusPoint: (setter) =>
    stateSetter(set, setter, `debug_zoomFocusPoint`),
})
