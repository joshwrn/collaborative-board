import { RotationPoint } from '@/components/Window/RotationPoints'
import { Point2d } from '.'
import { AppStateCreator, Setter, stateSetter } from './state'

export type ElementTypes = 'connections' | 'item'

export type DebugStore = {
  debug_zoomFocusPoint: Point2d | null
  debug_setZoomFocusPoint: Setter<Point2d | null>

  debug_randomPoints: (Point2d & { label: string })[]
  debug_setRandomPoints: Setter<(Point2d & { label: string })[]>
}

export const debugStore: AppStateCreator<DebugStore> = (set, get) => ({
  debug_zoomFocusPoint: null,
  debug_setZoomFocusPoint: (setter) =>
    stateSetter(set, setter, `debug_zoomFocusPoint`),

  debug_randomPoints: [],
  debug_setRandomPoints: (setter) =>
    stateSetter(set, setter, `debug_randomPoints`),
})
