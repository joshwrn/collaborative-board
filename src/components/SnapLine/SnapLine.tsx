import React from 'react'
import style from './SnapLine.module.scss'
import { useStore } from '@/state/gen-state'
import { distance } from 'mathjs'
import { SnappingToPosition } from '@/state/snapping'

export const SnapLineY: React.FC<{
  yPos: SnappingToPosition | null
  zoom: number
}> = ({ yPos, zoom }) => {
  if (!yPos) {
    return null
  }

  const yDistance = distance([yPos.from.x, yPos.from.y], [yPos.to.x, yPos.to.y])
  return (
    <span
      className={style.line}
      style={{
        left: yPos.dir === -1 ? yPos.to.x : yPos.from.x,
        top: yPos.from.y,
        height: `${1 / zoom}px`,
        width: yDistance.toString() + 'px',
      }}
    />
  )
}

export const SnapLineX: React.FC<{
  xPos: SnappingToPosition | null
  zoom: number
}> = ({ xPos, zoom }) => {
  if (!xPos) {
    return null
  }

  const xDistance = distance([xPos.from.x, xPos.from.y], [xPos.to.x, xPos.to.y])
  return (
    <span
      className={style.line}
      style={{
        left: xPos.from.x,
        top: xPos.dir === -1 ? xPos.to.y : xPos.from.y,
        width: `${1 / zoom}px`,
        height: xDistance.toString() + 'px',
      }}
    />
  )
}

const SnapLines_Internal: React.FC = () => {
  const state = useStore(['snapLines', 'zoom'])
  if (state.snapLines.length === 0) {
    return null
  }
  return (
    <>
      {state.snapLines.map((pos, i) => {
        const key = createKey(pos)
        if (pos.axis === 'y') {
          return <SnapLineY key={key + i} yPos={pos} zoom={state.zoom} />
        } else {
          return <SnapLineX key={key + i} xPos={pos} zoom={state.zoom} />
        }
      })}
    </>
  )
}

export const SnapLines = React.memo(SnapLines_Internal)

const createKey = (pos: SnappingToPosition) => {
  return pos.from.x + pos.from.y + pos.to.x + pos.to.y + pos.axis + pos.dir
}
