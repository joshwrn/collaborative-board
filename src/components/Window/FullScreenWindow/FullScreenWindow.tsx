import { FloatingPortal } from '@floating-ui/react'
import React from 'react'

import { useStore } from '@/state/gen-state'

import { Window } from '../Window'
import style from './FullScreenWindow.module.scss'

export const FullScreenWindow: React.FC = () => {
  const state = useStore([
    `fullScreenWindow`,
    `setFullScreenWindow`,
    `items`,
    `windows`,
  ])

  const window = state.windows.find(
    (curWindow) => curWindow.id === state.fullScreenWindow,
  )
  if (!window) return null

  const item = state.items.find((curItem) => curItem.id === window.id)
  if (!item) return null

  return (
    <FloatingPortal>
      <div className={style.container}>
        <div
          className={style.backdrop}
          onClick={() => state.setFullScreenWindow(null)}
        />
        <Window
          window={window}
          item={item}
          isFullScreen={true}
          isPinned={false}
        />
      </div>
    </FloatingPortal>
  )
}
