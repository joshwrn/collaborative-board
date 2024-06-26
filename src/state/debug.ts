import { RotationPoint } from '@/components/Window/RotationPoints'
import { Point2d } from '.'
import { AppStateCreator, Setter, stateSetter } from './state'

export type ElementTypes = 'connections' | 'item'

export type DebugStore = {
  debug_zoomFocusPoint: Point2d
  debug_setZoomFocusPoint: Setter<Point2d>
  debug_rotationPoints: Record<RotationPoint, Point2d | null>
  debug_setRotationPoints: Setter<Record<RotationPoint, Point2d | null>>
}

export const debugStore: AppStateCreator<DebugStore> = (set, get) => ({
  debug_zoomFocusPoint: { x: 0, y: 0 },
  debug_setZoomFocusPoint: (setter) =>
    stateSetter(set, setter, `debug_zoomFocusPoint`),
  debug_rotationPoints: {
    topLeft: null,
    topRight: null,
    bottomRight: null,
    bottomLeft: null,
  },
  debug_setRotationPoints: (setter) =>
    stateSetter(set, setter, `debug_rotationPoints`),
})
