import React from 'react'
import { atom, computed } from 'signia'
import { Point2d } from '@/state'
import { SPACE_ATTRS } from '@/state/space'

export type WindowType = {
  id: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
}

export const WINDOW_ATTRS = {
  defaultSize: { width: 700, height: 500 },
  minSize: 300,
  maxSize: 1000,
  zIndex: 0,
}
export const DEFAULT_WINDOW: WindowType = {
  id: '',
  x: 0,
  y: 0,
  width: WINDOW_ATTRS.defaultSize.width,
  height: WINDOW_ATTRS.defaultSize.height,
  zIndex: 0,
}

export const newWindowSizeInBounds = (
  newSize: {
    width: number
    height: number
  },
  currentSize: { width: number; height: number },
) => {
  let size = { width: newSize.width, height: newSize.height }
  if (size.width < WINDOW_ATTRS.minSize) {
    size.width = WINDOW_ATTRS.minSize
  }
  if (size.height < WINDOW_ATTRS.minSize) {
    size.height = WINDOW_ATTRS.minSize
  }
  if (size.width > WINDOW_ATTRS.maxSize) {
    size.width = WINDOW_ATTRS.maxSize
  }
  if (size.height > WINDOW_ATTRS.maxSize) {
    size.height = WINDOW_ATTRS.maxSize
  }
  return size
}

const createNewWindowPosition = (windows: WindowType[]) => {
  const startingPosition = {
    x: SPACE_ATTRS.size / 2 - WINDOW_ATTRS.defaultSize.width / 2,
    y: SPACE_ATTRS.size / 2 - WINDOW_ATTRS.defaultSize.height / 2,
  }
  for (let i = 0; i < windows.length; i++) {
    const window = windows[i]
    if (window.x === startingPosition.x && window.y === startingPosition.y) {
      startingPosition.x += 20
      startingPosition.y += 20
      i = 0
    }
  }
  return startingPosition
}

export class WindowsStore {
  private readonly windowsState = atom<WindowType[]>('Store.windows', [])

  @computed get open() {
    return this.windowsState.value
  }

  findOne(id: string) {
    return this.windowsState.value.find((window) => window.id === id)
  }

  setWindowPosition = (id: string, position: Point2d) => {
    this.windowsState.update((windows) =>
      windows.map((window) =>
        window.id === id ? { ...window, ...position } : window,
      ),
    )
  }

  setWindows = (windows: WindowType[]) => {
    this.windowsState.update(() => windows)
  }
}
