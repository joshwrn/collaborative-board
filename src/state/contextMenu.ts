import { Point2d } from '.'
import { AppStateCreator, Setter, stateSetter } from './state'

export type ElementTypes = 'connections' | 'item'

type ContextMenu = {
  position: Point2d
  id: string
  elementType: ElementTypes
} | null

export type ContextMenuStore = {
  contextMenu: ContextMenu | null
  setContextMenu: Setter<ContextMenu | null>
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
  setContextMenu: (setter) => stateSetter(set, setter, `contextMenu`),
  openContextMenu: ({ id, elementType }) => {
    const position = get().mousePosition
    set(() => ({
      contextMenu: {
        id,
        elementType,
        position,
      },
    }))
  },
})
