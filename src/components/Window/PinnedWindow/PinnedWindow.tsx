import React from 'react'
import style from './PinnedWindow.module.scss'

import { useStore } from '@/state/gen-state'
import { Window } from '../Window'
import { FloatingPortal } from '@floating-ui/react'
import { WINDOW_ATTRS } from '@/state/windows'

export const DEFAULT_PINNED_WINDOW_ZOOM = 0.5

const PinnedWindow_Internal: React.FC = () => {
  const state = useStore(['pinnedWindow', 'items', 'windows'])

  const window = state.windows.find((window) => window.id === state.pinnedWindow)
  if (!window) return null

  const item = state.items.find((item) => item.id === window.id)
  if (!item) return null

  return (
    <FloatingPortal>
      <div
        className={style.container}
        style={{
          width: WINDOW_ATTRS.defaultSize.width,
          height: WINDOW_ATTRS.defaultSize.height,
          scale: DEFAULT_PINNED_WINDOW_ZOOM,
        }}
      >
        <Window
          window={window}
          item={item}
          isFullScreen={false}
          isPinned={true}
        />
      </div>
    </FloatingPortal>
  )
}

export const PinnedWindow = React.memo(PinnedWindow_Internal)
