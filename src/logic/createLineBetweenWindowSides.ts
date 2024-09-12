import type { Point2d } from '@/state'
import { CONNECTION_MARGINS } from '@/state/connections'
import type { WindowType } from '@/state/windows'

export interface LineBetweenWindows {
  from: Point2d
  to: Point2d
}

export const createLineBetweenWindows = (
  windowFrom: WindowType,
  windowTo: WindowType,
): LineBetweenWindows => {
  return {
    from: pointFromItem(windowFrom),
    to: pointToItem(windowTo),
  }
}

const pointFromItem = (window: WindowType) => {
  const { x, y, width } = window
  return {
    y: y,
    x: x + width + CONNECTION_MARGINS.from,
  }
}
const pointToItem = (window: WindowType) => {
  const { x, y } = window
  return { y: y, x: x - CONNECTION_MARGINS.to }
}
