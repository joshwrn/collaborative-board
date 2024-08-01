import React from 'react'
import style from './LoadingOverlay.module.scss'
import { useStore } from '@/state/gen-state'

export const LoadingOverlay: React.FC<{
  itemId: string
}> = ({ itemId }) => {
  const state = useStore(['generatingCanvas'])
  if (
    !state.generatingCanvas.length ||
    !state.generatingCanvas.includes(itemId)
  ) {
    return null
  }
  return <div className={style.wrapper}></div>
}