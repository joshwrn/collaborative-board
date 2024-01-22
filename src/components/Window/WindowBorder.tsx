import type { FC } from 'react'
import React from 'react'

import styles from './WindowBorder.module.scss'
import animations from '@/style/spinningBackground.module.scss'
import { DraggableCore, DraggableData, DraggableEvent } from 'react-draggable'
import { useAppStore } from '@/state/gen-state'
import { setCursorStyle } from '@/utils/setCursor'
import { joinClasses } from '@/utils/joinClasses'
import { useShallow } from 'zustand/react/shallow'

const borderPositions = [
  'left',
  'topLeft',
  'top',
  'topRight',
  'right',
  'bottomRight',
  'bottom',
  'bottomLeft',
] as const

type BorderPosition = (typeof borderPositions)[number]
const cursorsForBorderPositions: Record<BorderPosition, string> = {
  left: 'ew-resize',
  topLeft: 'nwse-resize',
  top: 'ns-resize',
  topRight: 'nesw-resize',
  right: 'ew-resize',
  bottomRight: 'nwse-resize',
  bottom: 'ns-resize',
  bottomLeft: 'nesw-resize',
}

export const WindowBorder: FC<{
  id: string
  width: number
  height: number
  position: { x: number; y: number }
}> = ({ width, height, id, position }) => {
  const state = useAppStore(
    useShallow((state) => ({
      resizeWindow: state.resizeWindow,
      activeConnection: state.activeConnection,
      hoveredItem: state.hoveredItem,
    })),
  )

  const startPosition = React.useRef<{ x: number; y: number } | null>(null)
  const startSize = React.useRef<{ width: number; height: number } | null>(null)
  const totalMovement = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const onDrag = (
    e: DraggableEvent,
    data: DraggableData,
    pos: BorderPosition,
  ) => {
    if (!(e instanceof MouseEvent)) return
    const { movementX, movementY } = e
    if (!startSize.current || !startPosition.current) return

    totalMovement.current = {
      x: totalMovement.current.x + movementX,
      y: totalMovement.current.y + movementY,
    }

    const start = {
      x: startPosition.current.x,
      y: startPosition.current.y,
      width: startSize.current.width,
      height: startSize.current.height,
    }

    state.resizeWindow(id, start, totalMovement.current, pos)
  }
  const onDragStart = (
    e: DraggableEvent,
    data: DraggableData,
    pos: BorderPosition,
  ) => {
    startSize.current = { width, height }
    startPosition.current = { x: position.x, y: position.y }
    setCursorStyle(cursorsForBorderPositions[pos])
  }
  const onDragStop = (
    e: DraggableEvent,
    data: DraggableData,
    pos: BorderPosition,
  ) => {
    startSize.current = null
    startPosition.current = null
    totalMovement.current = { x: 0, y: 0 }
    setCursorStyle('default')
  }
  const isActive = state.activeConnection?.from === id
  return (
    <div
      className={joinClasses(
        styles.border,
        isActive && animations.spinningBg,
        state.hoveredItem === id && animations.spinningBg,
      )}
      style={{
        width: `${width + 2}px`,
        height: `${height + 2}px`,
      }}
    >
      {borderPositions.map((pos) => (
        <DraggableCore
          key={pos}
          onDrag={(e, data) => onDrag(e, data, pos)}
          onStart={(e, data) => onDragStart(e, data, pos)}
          onStop={(e, data) => onDragStop(e, data, pos)}
        >
          <div className={styles[pos]} />
        </DraggableCore>
      ))}
    </div>
  )
}
