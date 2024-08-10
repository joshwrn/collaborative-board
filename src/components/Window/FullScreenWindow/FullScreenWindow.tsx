import React from 'react'
import style from './FullScreenWindow.module.scss'
import { useStore } from '@/state/gen-state'
import { Window } from '../Window'
import { FloatingPortal } from '@floating-ui/react'

export const FullScreenWindow: React.FC = () => {
  const state = useStore([
    'fullScreenWindow',
    'setFullScreenWindow',
    'items',
    'windows',
  ])

  const window = state.windows.find(
    (window) => window.id === state.fullScreenWindow,
  )
  if (!window) return null

  const item = state.items.find((item) => item.id === window.id)
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
