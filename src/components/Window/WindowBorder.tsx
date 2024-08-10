import type { FC } from 'react'
import React from 'react'

import styles from './WindowBorder.module.scss'
import { DraggableCore, DraggableData, DraggableEvent } from 'react-draggable'
import { useStore } from '@/state/gen-state'
import { setCursorStyle } from '@/utils/setCursor'
import { joinClasses } from '@/utils/joinClasses'
import { WINDOW_ATTRS, WindowType } from '@/state/windows'

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

const returnStyle = (
  width: number,
  height: number,
  isFullScreen: boolean,
  isPinned: boolean,
): React.CSSProperties => {
  if (isFullScreen) {
    return {
      width: `calc(${WINDOW_ATTRS.defaultFullScreenSize.width}px + 2px)`,
      height: `calc(${WINDOW_ATTRS.defaultFullScreenSize.height}px + 2px)`,
    }
  }
  if (isPinned) {
    return {
      width: WINDOW_ATTRS.defaultSize.width + 'px',
      height: WINDOW_ATTRS.defaultSize.height + 'px',
    }
  }
  return {
    width: width + 2 + 'px',
    height: height + 2 + 'px',
  }
}

export const WindowBorderInternal: FC<{
  id: string
  width: number
  height: number
  isFullScreen: boolean
  isPinned: boolean
  position: { x: number; y: number }
}> = ({ width, height, id, position, isFullScreen, isPinned }) => {
  const state = useStore([
    'resizeWindow',
    'activeConnection',
    'hoveredItem',
    'selectedWindow',
  ])

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
        isActive && styles.activeBorder,
        state.selectedWindow === id && !isFullScreen && styles.activeBorder,
        state.hoveredItem === id && !isFullScreen && styles.hoveredBorder,
      )}
      style={returnStyle(width, height, isFullScreen, isPinned)}
    >
      {borderPositions.map((pos) => (
        <DraggableCore
          key={pos}
          onDrag={(e, data) => onDrag(e, data, pos)}
          onStart={(e, data) => onDragStart(e, data, pos)}
          onStop={(e, data) => onDragStop(e, data, pos)}
          disabled={isFullScreen || isPinned}
        >
          <div
            className={styles[pos]}
            id={`window-border-draggable-${pos}-${id}`}
          />
        </DraggableCore>
      ))}
    </div>
  )
}

export const WindowBorder = React.memo(WindowBorderInternal)
