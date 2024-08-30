'use client'
import React from 'react'

import { spaceCenterPoint } from '@/logic/spaceCenterPoint'
import { useStore } from '@/state/gen-state'
import { allowDebugItem } from '@/utils/is-dev'

import style from './Debug.module.scss'

const showDebug = allowDebugItem(false)

export const Debug: React.FC = () => {
  const state = useStore([
    `debug_zoomFocusPoint`,
    `debug_randomPoints`,
    `debug_centerPoint`,
    `setState`,
    `zoom`,
    `pan`,
  ])

  React.useEffect(() => {
    const newPos = spaceCenterPoint(state.zoom, state.pan)
    state.setState((draft) => {
      draft.debug_centerPoint = newPos
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.pan, state.zoom, state.setState])

  if (!showDebug) {
    return null
  }
  return (
    <>
      {state.debug_zoomFocusPoint && (
        <div
          className={style.zoomFocusPoint}
          style={{
            transform: `translate(${state.debug_zoomFocusPoint.x}px, ${state.debug_zoomFocusPoint.y}px)`,
          }}
        />
      )}
      {state.debug_randomPoints.map((point, i) => {
        return (
          <div
            key={i}
            className={style.randomPoint}
            style={{
              transform: `translate(${point.x}px, ${point.y}px)`,
            }}
          >
            <div />
            <p>{point.label}</p>
          </div>
        )
      })}
      {state.debug_centerPoint && (
        <div
          className={style.centerPoint}
          style={{
            transform: `translate(${state.debug_centerPoint.x}px, ${state.debug_centerPoint.y}px)`,
          }}
        />
      )}
    </>
  )
}
