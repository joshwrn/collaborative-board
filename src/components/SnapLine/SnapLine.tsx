import React from 'react'
import style from './SnapLine.module.scss'
import { useAppStore } from '@/state/gen-state'
import { useShallow } from 'zustand/react/shallow'
import { distance } from 'mathjs'
import { SnappingToPositions } from '@/state/windows'

export const SnapLineY: React.FC<{
  yPos: SnappingToPositions['y'] | null
}> = ({ yPos }) => {
  if (!yPos) {
    return null
  }

  const yDistance = distance([yPos.from.x, yPos.from.y], [yPos.to.x, yPos.to.y])
  return (
    <>
      <div
        className={style.line}
        style={{
          left: yPos.dir === -1 ? yPos.to.x : yPos.from.x,
          top: yPos.from.y,
          height: '2px',
          width: yDistance.toString() + 'px',
        }}
      />
    </>
  )
}

export const SnapLineX: React.FC<{
  xPos: SnappingToPositions['x'] | null
}> = ({ xPos }) => {
  if (!xPos) {
    return null
  }

  const xDistance = distance([xPos.from.x, xPos.from.y], [xPos.to.x, xPos.to.y])
  return (
    <>
      <div
        className={style.line}
        style={{
          left: xPos.from.x,
          top: xPos.dir === -1 ? xPos.to.y : xPos.from.y,
          width: '2px',
          height: xDistance.toString() + 'px',
        }}
      />
    </>
  )
}

export const SnapLines: React.FC = () => {
  const state = useAppStore(
    useShallow((state) => {
      return {
        snappingToPositions: state.snappingToPositions,
      }
    }),
  )
  return (
    <>
      <SnapLineX xPos={state.snappingToPositions.x} />
      <SnapLineY yPos={state.snappingToPositions.y} />
    </>
  )
}
