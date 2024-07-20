import React from 'react'
import style from './FullScreenWindow.module.scss'
import { useAppStore } from '@/state/gen-state'
import { useShallow } from 'zustand/react/shallow'
import { Window } from '../Window'
import { FloatingPortal } from '@floating-ui/react'

export const FullScreenWindow: React.FC = () => {
  const state = useAppStore(
    useShallow((state) => ({
      fullScreenWindow: state.fullScreenWindow,
      setFullScreenWindow: state.setFullScreenWindow,
      items: state.items,
      windows: state.windows,
    })),
  )

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
        <Window window={window} item={item} isFullScreen={true} />
      </div>
    </FloatingPortal>
  )
}
