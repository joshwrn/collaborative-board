import type { Item } from '@/state/items'
import { SPACE_ATTRS } from '@/state/space'
import type { WindowType } from '@/state/windows'
import { DEFAULT_WINDOW } from '@/state/windows'

export const AMT_OF_WINDOWS = 99

const randomPosition = (x: boolean) => {
  const pos = Math.random() * 10000 + SPACE_ATTRS.size.default / 2 - 5000
  return pos
}

export const createMockWindow = (
  mockItems: Item[],
  windowProps: Partial<WindowType> = {},
): WindowType[] =>
  Array.from({ length: mockItems.length }, (_, i) => {
    const item = mockItems[i]
    return {
      ...DEFAULT_WINDOW,
      id: item.id,
      x: randomPosition(true),
      y: randomPosition(false),
      ...windowProps,
    }
  })
