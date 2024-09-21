import { FloatingPortal } from '@floating-ui/react'
import React, { useMemo } from 'react'

import { useStore } from '@/state/gen-state'

import { Window } from '../Window'
import style from './FullScreenWindow.module.scss'

export const FullScreenWindow: React.FC = () => {
  const state = useStore([
    `fullScreenWindow`,
    `setFullScreenWindow`,
    `windows`,
    `loadingItemId`,
  ])

  const window = useMemo(() => {
    return state.windows.find((w) => w.id === state.fullScreenWindow)
  }, [state.windows, state.fullScreenWindow])

  if (!window) return null

  return (
    <FloatingPortal>
      <div className={style.container}>
        <div
          className={style.backdrop}
          onClick={() => state.setFullScreenWindow(null)}
        />
        <Window
          window={window}
          isFullScreen={true}
          isPinned={false}
          isLoading={state.loadingItemId === window.id}
        />
      </div>
    </FloatingPortal>
  )
}
