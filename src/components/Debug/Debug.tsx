'use client'
import React from 'react'
import style from './Debug.module.scss'
import { useAppStore } from '@/state/gen-state'
import { useShallow } from 'zustand/react/shallow'
import { joinClasses } from '@/utils/joinClasses'

const showDebug = true

export const Debug: React.FC = () => {
  const state = useAppStore(
    useShallow((state) => ({
      zoomFocusPoint: state.debug_zoomFocusPoint,
      randomPoints: state.debug_randomPoints,
    })),
  )
  if (process.env.NEXT_PUBLIC_SHOW_DEBUG !== 'true' || !showDebug) {
    return null
  }
  return (
    <>
      {state.zoomFocusPoint && (
        <div
          className={style.zoomFocusPoint}
          style={{
            transform: `translate(${state.zoomFocusPoint.x}px, ${state.zoomFocusPoint.y}px)`,
          }}
        />
      )}
      {state.randomPoints.map((point, i) => {
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
