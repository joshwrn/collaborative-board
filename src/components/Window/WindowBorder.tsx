import type { FC } from 'react'
import React from 'react'

import styles from './WindowBorder.module.scss'
import { DraggableCore, DraggableData, DraggableEvent } from 'react-draggable'
import { useAppStore } from '@/state/state'
import { setCursorStyle } from '@/utils/setCursor'

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
const cursorsForBorderPositions: Record<
  (typeof borderPositions)[number],
  string
> = {
  left: 'ew-resize',
  topLeft: 'nwse-resize',
  top: 'ns-resize',
  topRight: 'nesw-resize',
  right: 'ew-resize',
  bottomRight: 'nwse-resize',
  bottom: 'ns-resize',
  bottomLeft: 'nesw-resize',
}
type BorderPosition = (typeof borderPositions)[number]

export const WindowBorder: FC<{
  id: string
  width: number
  height: number
  position: { x: number; y: number }
}> = ({ width, height, id, position }) => {
  const { setOneWindowSize, setOneWindowPosition, zoom } = useAppStore(
    (state) => ({
      setOneWindowSize: state.setOneWindowSize,
      setOneWindowPosition: state.setOneWindowPosition,
      zoom: state.zoom,
    }),
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
    const scaledMovement = {
      x: totalMovement.current.x / zoom,
      y: totalMovement.current.y / zoom,
    }

    let newSize = { width, height }
    let newPosition = { x: position.x, y: position.y }

    const start = {
      x: startPosition.current.x,
      y: startPosition.current.y,
      width: startSize.current.width,
      height: startSize.current.height,
    }

    const createNewPosition = (axis: 'x' | 'y') => {
      if (axis === 'x') {
        return newSize.width < 300 ? position.x : start.x + scaledMovement.x
      }
      return newSize.height < 300 ? position.y : start.y + scaledMovement.y
    }

    switch (pos) {
      case 'left': {
        newSize.width = start.width - scaledMovement.x
        newPosition.x = createNewPosition('x')
        break
      }
      case 'topLeft': {
        newSize = {
          width: start.width - scaledMovement.x,
          height: start.height - scaledMovement.y,
        }
        newPosition.x = createNewPosition('x')
        newPosition.y = createNewPosition('y')
        break
      }
      case 'top': {
        newSize.height = start.height - scaledMovement.y
        newPosition.y = createNewPosition('y')
        break
      }
      case 'topRight': {
        newSize = {
          width: start.width + scaledMovement.x,
          height: start.height - scaledMovement.y,
        }
        newPosition.y = createNewPosition('y')
        break
      }
      case 'right': {
        newSize.width = start.width + scaledMovement.x
        break
      }
      case 'bottomRight': {
        newSize = {
          width: start.width + scaledMovement.x,
          height: start.height + scaledMovement.y,
        }
        break
      }
      case 'bottom': {
        newSize.height = start.height + scaledMovement.y
        break
      }
      case 'bottomLeft': {
        newSize = {
          width: start.width - scaledMovement.x,
          height: start.height + scaledMovement.y,
        }
        break
      }
    }
    setOneWindowSize(id, newSize)
    setOneWindowPosition(id, newPosition)
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
  return (
    <div
      className={styles.border}
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
