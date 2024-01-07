import { Point2d } from '.'
import { AppStateCreator, AppStore, Setter, stateSetter } from './state'

type ContextMenu = {
  position: Point2d
  id: string
  elementType: keyof AppStore
} | null

export type ContextMenuStore = {
  contextMenu: ContextMenu | null
  setContextMenu: Setter<ContextMenu | null>
  openContextMenu: ({
    id,
    elementType,
  }: {
    id: string
    elementType: keyof AppStore
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
