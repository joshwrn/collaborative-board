import { Point2d } from '.'
import { AppStateCreator } from './state'

export type ElementTypes = 'connections' | 'item' | 'space'

type ContextMenu =
  | {
      position: Point2d
      elementType: 'space'
      data: {
        x: number
        y: number
      }
    }
  | {
      position: Point2d
      id: string
      elementType: 'connections'
    }
  | {
      position: Point2d
      id: string
      elementType: 'item'
    }

export type ContextMenuStore = {
  contextMenu: ContextMenu | null
  openContextMenu: ({
    id,
    elementType,
  }: {
    id: string
    elementType: ElementTypes
  }) => void
}

export const contextMenuStore: AppStateCreator<ContextMenuStore> = (
  set,
  get,
) => ({
  contextMenu: null,
  openContextMenu: ({ id, elementType }) => {
    const state = get()
    const position = state.mousePosition
    switch (elementType) {
      case 'connections':
        set(() => ({
          contextMenu: {
            id,
            elementType,
            position,
          },
        }))
        return
      case 'item':
        set(() => ({
          contextMenu: {
            id,
            elementType,
            position,
          },
        }))
        return
      case 'space':
        const { x, y } = state.spaceMousePosition
        set(() => ({
          contextMenu: {
            elementType,
            position,
            data: {
              x,
              y,
            },
          },
        }))
        return
    }
  },
})
