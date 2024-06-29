import { RotationPoint } from '@/components/Window/RotationPoints'
import { Point2d } from '.'
import { AppStateCreator, Setter, stateSetter } from './state'

export type ElementTypes = 'connections' | 'item'

export type DebugStore = {
  debug_zoomFocusPoint: Point2d
  debug_setZoomFocusPoint: Setter<Point2d>

  debug_rotationPoints: Record<RotationPoint, Point2d | null>
  debug_setRotationPoints: Setter<Record<RotationPoint, Point2d | null>>

  debug_snapPoints: {
    from: Point2d[]
    to: Point2d[]
  }
  debug_setSnapPoints: Setter<{
    from: Point2d[]
    to: Point2d[]
  }>

  debug_newCenterPoint: Point2d
  debug_setNewCenterPoint: Setter<Point2d>

  debug_randomPoints: (Point2d & { label: string })[]
  debug_setRandomPoints: Setter<(Point2d & { label: string })[]>
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

  debug_snapPoints: {
    from: [],
    to: [],
  },
  debug_setSnapPoints: (setter) => stateSetter(set, setter, `debug_snapPoints`),

  debug_newCenterPoint: { x: 0, y: 0 },
  debug_setNewCenterPoint: (setter) =>
    stateSetter(set, setter, `debug_newCenterPoint`),

  debug_randomPoints: [],
  debug_setRandomPoints: (setter) =>
    stateSetter(set, setter, `debug_randomPoints`),
})
