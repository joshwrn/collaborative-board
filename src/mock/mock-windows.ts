import { WindowType, DEFAULT_WINDOW } from '@/state/windows'
import { SPACE_ATTRS } from '@/state/space'
import { Item } from '@/state/items'

export const AMT_OF_WINDOWS = 99

const randomPosition = (x: boolean) => {
  const pos = Math.floor(Math.random() * SPACE_ATTRS.size.default)
  if (x && pos > SPACE_ATTRS.size.default - DEFAULT_WINDOW.width) {
    return pos - DEFAULT_WINDOW.width
  }
  if (!x && pos > SPACE_ATTRS.size.default - DEFAULT_WINDOW.height) {
    return pos - DEFAULT_WINDOW.height
  }
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
