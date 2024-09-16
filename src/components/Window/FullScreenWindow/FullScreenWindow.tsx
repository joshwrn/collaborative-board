import { FloatingPortal } from '@floating-ui/react'
import React from 'react'

import { useZ } from '@/state/gen-state'

import { Window } from '../Window'
import style from './FullScreenWindow.module.scss'
import { findWindow } from '@/state/windows'
import { findItem } from '@/state/items'

export const FullScreenWindow: React.FC = () => {
  const state = useZ(['setFullScreenWindow'], (state) => {
    const window = findWindow(state.windows, state.fullScreenWindow)
    return {
      window,
      item: findItem(state.items, window?.id),
    }
  })

  if (state.window.id === `default-id` || state.item.id === `default-id`) {
    return null
  }

  return (
    <FloatingPortal>
      <div className={style.container}>
        <div
          className={style.backdrop}
          onClick={() => state.setFullScreenWindow(null)}
        />
        <Window id={state.item.id} isFullScreen={true} isPinned={false} />
      </div>
    </FloatingPortal>
  )
}
