import { RotationPoint } from '@/components/Window/RotationPoints'
import { Point2d } from '.'
import { AppStateCreator, Setter, stateSetter } from './state'

export type ElementTypes = 'connections' | 'item'

export type DebugStore = {
  debug_zoomFocusPoint: Point2d | null

  debug_randomPoints: (Point2d & { label: string })[]

  debug_showZustandDevTools: boolean
  debug_setShowZustandDevTools: Setter<boolean>

  debug_showFps: boolean
}

export const debugStore: AppStateCreator<DebugStore> = (set, get) => ({
  debug_zoomFocusPoint: null,

  debug_randomPoints: [],

  debug_showZustandDevTools: false,
  debug_setShowZustandDevTools: (setter) =>
    stateSetter(set, setter, `debug_showZustandDevTools`),

  debug_showFps: true,
})
