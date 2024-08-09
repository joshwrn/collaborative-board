import React from 'react'
import style from './LoadingOverlay.module.scss'
import { useStore } from '@/state/gen-state'

export const LoadingOverlay: React.FC<{
  itemId: string
}> = ({ itemId }) => {
  const state = useStore(['generatingCanvas'])
  if (
    !state.generatingCanvas.length ||
    !state.generatingCanvas.find((c) => c.newItemId === itemId)
  ) {
    return null
  }
  return (
    <div className={'loadingShimmer'}>
      <div className={style.blocker}></div>
    </div>
  )
}
