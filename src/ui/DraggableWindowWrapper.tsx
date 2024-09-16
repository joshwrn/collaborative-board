import React from 'react'
import type {
  DraggableData,
  DraggableEvent,
  DraggableProps,
} from 'react-draggable'
import { DraggableCore } from 'react-draggable'

import { useFullStore, useZ } from '@/state/gen-state'
import { DEFAULT_WINDOW } from '@/state/windows'

export const DraggableWindowWrapper: React.FC<{
  windowId: string
  children: React.ReactNode
  nodeRef: React.RefObject<HTMLDivElement>
  dragProps?: Partial<DraggableProps>
}> = ({ windowId, children, nodeRef, dragProps }) => {
  const state = useZ(
    [`snapToWindows`, `setSnapLines`, `setState`, `hasOrganizedWindows`],
    (state) => {
      const window = state.windows.find((w) => w.id === windowId)
      return {
        window,
      }
    },
  )
  const window = state.window ?? DEFAULT_WINDOW
  const realPosition = React.useRef({ x: window.x, y: window.y })

  React.useEffect(() => {
    realPosition.current = { x: window.x, y: window.y }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.hasOrganizedWindows, window.width, window.height])

  const onDrag = (e: DraggableEvent, data: DraggableData) => {
    if (!(e instanceof MouseEvent)) return
    const { movementX, movementY } = e
    if (!movementX && !movementY) return
    const { zoom } = useFullStore.getState()
    const scaledPosition = {
      x: movementX / zoom,
      y: movementY / zoom,
    }
    realPosition.current = {
      x: realPosition.current.x + scaledPosition.x,
      y: realPosition.current.y + scaledPosition.y,
    }
    state.snapToWindows(window.id, {
      ...window,
      ...realPosition.current,
    })
  }

  const onDragStop = (e: DraggableEvent, data: DraggableData) => {
    state.setSnapLines([])
  }
  return (
    <DraggableCore
      onDrag={onDrag}
      onStop={onDragStop}
      handle=".handle"
      nodeRef={nodeRef}
      {...dragProps}
    >
      {children}
    </DraggableCore>
  )
}
