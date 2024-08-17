import { FloatingPortal } from '@floating-ui/react'
import React from 'react'

import { useStore } from '@/state/gen-state'
import { WINDOW_ATTRS } from '@/state/windows'

import { Window } from '../Window'
import style from './PinnedWindow.module.scss'

export const DEFAULT_PINNED_WINDOW_ZOOM = 0.5

const PinnedWindow_Internal: React.FC = () => {
  const state = useStore([`pinnedWindow`, `items`, `windows`])

  const window = state.windows.find(
    (curWindow) => curWindow.id === state.pinnedWindow,
  )
  if (!window) return null

  const item = state.items.find((curItem) => curItem.id === window.id)
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
