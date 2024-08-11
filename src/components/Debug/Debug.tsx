'use client'
import React from 'react'
import style from './Debug.module.scss'
import { useStore } from '@/state/gen-state'

const showDebug = true

export const Debug: React.FC = () => {
  const state = useStore(['debug_zoomFocusPoint', 'debug_randomPoints'])

  if (process.env.NEXT_PUBLIC_SHOW_DEBUG !== 'true' || !showDebug) {
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
    </>
  )
}
