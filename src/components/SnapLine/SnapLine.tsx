import React from 'react'
import style from './SnapLine.module.scss'
import { useAppStore } from '@/state/gen-state'
import { useShallow } from 'zustand/react/shallow'
import { distance } from 'mathjs'
import { SnappingToPosition } from '@/state/snapping'

export const SnapLineY: React.FC<{
  yPos: SnappingToPosition | null
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
  xPos: SnappingToPosition | null
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
        snapLines: state.snapLines,
      }
    }),
  )
  console.log('SnapLines', state.snapLines)
  return (
    <>
      {state.snapLines.map((pos) => {
        const key = createKey(pos)
        if (pos.axis === 'y') {
          return <SnapLineY key={key} yPos={pos} />
        } else {
          return <SnapLineX key={key} xPos={pos} />
        }
      })}
    </>
  )
}

const createKey = (pos: SnappingToPosition) => {
  return pos.from.x + pos.from.y + pos.to.x + pos.to.y + pos.axis + pos.dir
}
