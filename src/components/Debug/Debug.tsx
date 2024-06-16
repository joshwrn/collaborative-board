import React from 'react'
import style from './Debug.module.scss'
import { useAppStore } from '@/state/gen-state'
import { useShallow } from 'zustand/react/shallow'

export const Debug: React.FC = () => {
  const state = useAppStore(
    useShallow((state) => ({
      zoomFocusPoint: state.debug_zoomFocusPoint,
    })),
  )
  return (
    <div
      className={style.zoomFocusPoint}
      style={{
        transform: `translate(${state.zoomFocusPoint.x}px, ${state.zoomFocusPoint.y}px)`,
      }}
    />
  )
}
