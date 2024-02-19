import { Window, DEFAULT_WINDOW } from '@/state/windows'
import { MOCK_ITEMS } from './mock-items'
import { SPACE_ATTRS } from '@/state/space'

export const AMT_OF_WINDOWS = 99

const randomPosition = (x: boolean) => {
  const pos = Math.floor(Math.random() * SPACE_ATTRS.size)
  if (x && pos > SPACE_ATTRS.size - DEFAULT_WINDOW.width) {
    return pos - DEFAULT_WINDOW.width
  }
  if (!x && pos > SPACE_ATTRS.size - DEFAULT_WINDOW.height) {
    return pos - DEFAULT_WINDOW.height
  }
  return pos
}

export const createMockWindow = (length: number): Window[] =>
  Array.from({ length }, (_, i) => {
    const item = MOCK_ITEMS[i]
    return {
      ...DEFAULT_WINDOW,
      id: item.id,
      x: randomPosition(true),
      y: randomPosition(false),
    }
  })
