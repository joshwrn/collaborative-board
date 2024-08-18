import type { Point2d } from '@/state'
import type { WindowType } from '@/state/windows'

const margins = {
  from: 25,
  to: 25,
}

export interface LineBetweenWindows {
  from: Point2d
  to: Point2d
}

export const createLineBetweenWindows = (
  windowFrom: WindowType,
  windowTo: WindowType,
): LineBetweenWindows => {
  const fromPoint = pointFrom(windowFrom)
  const toPoint = pointTo(windowTo)

  return {
    from: fromPoint,
    to: toPoint,
  }
}

const pointFrom = (window: WindowType) => {
  const { x, y, width, height } = window
  return { y: y + height / 2, x: x + width + margins.from }
}

const pointTo = (window: WindowType) => {
  const { x, y, height } = window
  return { y: y + height / 2, x: x - margins.to }
}
