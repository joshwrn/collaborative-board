import React from 'react'
import style from './RotationPoints.module.scss'
import { joinClasses } from '@/utils/joinClasses'
import { DraggableCore, DraggableEvent } from 'react-draggable'
import { useShallow } from 'zustand/react/shallow'
import { useAppStore } from '@/state/gen-state'
import { Point2d } from '@/state'
import { WindowType } from '@/state/windows'

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

const rotationsPointToDegrees: Record<RotationPoint, number> = {
  topLeft: -35,
  topRight: -145,
  bottomRight: 145,
  bottomLeft: 35,
}

type WrapAround = (value: number, range: [min: number, max: number]) => number

export const wrapAround: WrapAround = (value, [min, max]) =>
  ((((value - min) % (max - min)) + (max - min)) % (max - min)) + min

export const getDegrees = (
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  pos: RotationPoint,
) => {
  const min = 0
  const max = 360
  const angleRadians = Math.atan2(p2.y - p1.y, p2.x - p1.x)
  let angleDegrees = angleRadians * (180 / Math.PI)
  angleDegrees = Math.floor(angleDegrees + rotationsPointToDegrees[pos])
  const wrapped = wrapAround(angleDegrees, [min, max])
  return wrapped
}

export const RotationPoints: React.FC<{
  id: string
  window: WindowType
}> = ({ id, window }) => {
  const state = useAppStore(
    useShallow((state) => ({
      setOneWindow: state.setOneWindow,
      zoom: state.zoom,
      spaceMousePosition: state.spaceMousePosition,
    })),
  )

  const onDrag = (
    e: DraggableEvent,
    data: { deltaX: number; deltaY: number },
    pos: RotationPoint,
  ) => {
    if (!(e instanceof MouseEvent)) return
    const centerPoint = {
      y: window.y + window.height / 2,
      x: window.x + window.width / 2,
    }
    const mouse = {
      x: state.spaceMousePosition.x,
      y: state.spaceMousePosition.y,
    }
    const degrees = getDegrees(mouse, centerPoint, pos)
    state.setOneWindow(id, { rotation: degrees })
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
          transform: `rotate(-${window.rotation}deg)`,
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
