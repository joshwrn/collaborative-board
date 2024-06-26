'use client'
import React from 'react'
import style from './Debug.module.scss'
import { useAppStore } from '@/state/gen-state'
import { useShallow } from 'zustand/react/shallow'

const showDebug = true

export const Debug: React.FC = () => {
  const state = useAppStore(
    useShallow((state) => ({
      zoomFocusPoint: state.debug_zoomFocusPoint,
      rotationPoints: state.debug_rotationPoints,
    })),
  )
  if (process.env.NEXT_PUBLIC_SHOW_DEBUG !== 'true' || !showDebug) {
    return null
  }
  return (
    <>
      <div
        className={style.zoomFocusPoint}
        style={{
          transform: `translate(${state.zoomFocusPoint.x}px, ${state.zoomFocusPoint.y}px)`,
        }}
      />
      {Object.entries(state.rotationPoints).map(([key, value]) => {
        if (!value) {
          return null
        }
        return (
          <div
            key={key}
            className={style.rotationPoint}
            style={{
              top: value.y,
              left: value.x,
            }}
          />
        )
      })}
    </>
  )
}
