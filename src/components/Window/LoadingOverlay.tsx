import React from 'react'

import { useStore } from '@/state/gen-state'
import { joinClasses } from '@/utils/joinClasses'

import style from './LoadingOverlay.module.scss'

export const LoadingOverlay: React.FC<{
  itemId: string
}> = ({ itemId }) => {
  const state = useStore([`loadingCanvases`])
  if (
    !state.loadingCanvases.length ||
    !state.loadingCanvases.find((c) => c.newItemId === itemId)
  ) {
    return null
  }
  return (
    <div className={joinClasses(`loadingShimmer`, style.loadingShimmer)}>
      <div className={style.blocker}></div>
    </div>
  )
}
