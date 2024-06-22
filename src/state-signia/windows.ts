import React from 'react'
import { atom, computed } from 'signia'
import { WindowType } from '@/state/windows'
import { Point2d } from '@/state'

export class WindowsStore {
  private readonly windowsState = atom<WindowType[]>('Store.windows', [
    {
      id: '1',
      x: 0,
      y: 0,
      width: 700,
      height: 500,
      zIndex: 0,
    },
  ])

  @computed get open() {
    return this.windowsState.value
  }

  setWindowPosition = (id: string, position: Point2d) => {
    this.windowsState.update((windows) =>
      windows.map((window) =>
        window.id === id ? { ...window, ...position } : window,
      ),
    )
  }
}
