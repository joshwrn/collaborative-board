import React from 'react'
import style from './RotationPoints.module.scss'
import { joinClasses } from '@/utils/joinClasses'
import { DraggableCore, DraggableEvent } from 'react-draggable'
import { useShallow } from 'zustand/react/shallow'
import { useAppStore } from '@/state/gen-state'

export const ROTATION_POINTS = [
  'topLeft',
  'topRight',
  'bottomRight',
  'bottomLeft',
] as const

export type RotationPoint = (typeof ROTATION_POINTS)[number]

const cursorsForRotationPoints: Record<RotationPoint, string> = {
  topLeft: 'grab',
  topRight: 'grab',
  bottomRight: 'grab',
  bottomLeft: 'grab',
}

export const RotationPoints: React.FC<{
  id: string
  rotation: number
}> = ({ id, rotation }) => {
  const state = useAppStore(
    useShallow((state) => ({
      rotateWindow: state.rotateWindow,
    })),
  )

  const onDrag = (
    e: DraggableEvent,
    data: { deltaX: number; deltaY: number },
    pos: RotationPoint,
  ) => {
    if (!(e instanceof MouseEvent)) return
    const { movementX, movementY } = e
    state.rotateWindow(id, { x: movementX, y: movementY })
  }
  const onDragStart = (
    e: DraggableEvent,
    data: { deltaX: number; deltaY: number },
    pos: RotationPoint,
  ) => {
    console.log('start', pos)
  }
  const onDragStop = (
    e: DraggableEvent,
    data: { deltaX: number; deltaY: number },
    pos: RotationPoint,
  ) => {
    console.log('stop', pos)
  }

  return (
    <div className={style.wrapper}>
      <div
        className={style.rotationOutline}
        style={{
          transform: `rotate(-${rotation}deg)`,
        }}
      />
      {ROTATION_POINTS.map((pos) => {
        return (
          <DraggableCore
            key={pos}
            onDrag={(e, data) => onDrag(e, data, pos)}
            onStart={(e, data) => onDragStart(e, data, pos)}
            onStop={(e, data) => onDragStop(e, data, pos)}
          >
            <div className={joinClasses(style[pos], style.point)} />
          </DraggableCore>
        )
      })}
    </div>
  )
}
