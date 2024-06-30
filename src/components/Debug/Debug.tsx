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
      snapPoints: state.debug_snapPoints,
      newCenterPoint: state.debug_newCenterPoint,
      randomPoints: state.debug_randomPoints,
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
      {state.snapPoints.from.map((point, i) => {
        return (
          <div
            key={i}
            className={joinClasses(style.snapPoint, style.snapPointFrom)}
            style={{
              transform: `translate(${point.x}px, ${point.y}px)`,
            }}
          />
        )
      })}
      {state.snapPoints.to.map((point, i) => {
        return (
          <div
            key={i}
            className={joinClasses(style.snapPoint, style.snapPointTo)}
            style={{
              transform: `translate(${point.x}px, ${point.y}px)`,
            }}
          />
        )
      })}
      {state.newCenterPoint && (
        <div
          className={style.newCenterPoint}
          style={{
            transform: `translate(${state.newCenterPoint.x}px, ${state.newCenterPoint.y}px)`,
          }}
        />
      )}
    </>
  )
}
