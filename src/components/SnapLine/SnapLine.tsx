import React from 'react'
import style from './SnapLine.module.scss'
import { useAppStore } from '@/state/gen-state'
import { useShallow } from 'zustand/react/shallow'
import { distance } from 'mathjs'

export const SnapLine: React.FC = () => {
  const state = useAppStore(
    useShallow((state) => {
      return {
        snappingToPositions: state.snappingToPositions,
      }
    }),
  )
  const xPos = {
    from: {
      x: state.snappingToPositions.x?.from.x || 0,
      y: state.snappingToPositions.x?.from.y || 0,
    },
    to: {
      x: state.snappingToPositions.x?.to.x || 0,
      y: state.snappingToPositions.x?.to.y || 0,
    },
  }
  const yPos = {
    from: {
      x: state.snappingToPositions.y?.from.x || 0,
      y: state.snappingToPositions.y?.from.y || 0,
    },
    to: {
      x: state.snappingToPositions.y?.to.x || 0,
      y: state.snappingToPositions.y?.to.y || 0,
    },
  }
  const xDistance = distance([xPos.from.x, xPos.from.y], [xPos.to.x, xPos.to.y])
  const yDistance = distance([yPos.from.x, yPos.from.y], [yPos.to.x, yPos.to.y])
  return (
    <>
      <div
        className={style.line}
        style={{
          left: xPos.from.x,
          top: xPos.from.y,
          width: '2px',
          height: xDistance.toString() + 'px',
        }}
      />
      <div
        className={style.line}
        style={{
          left: yPos.from.x,
          top: yPos.from.y,
          height: '2px',
          width: yDistance.toString() + 'px',
        }}
      />
    </>
  )
}
