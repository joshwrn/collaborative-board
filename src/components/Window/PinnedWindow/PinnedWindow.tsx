import { FloatingPortal } from '@floating-ui/react'
import React from 'react'

import { useZ } from '@/state/gen-state'
import { findItem } from '@/state/items'
import { findWindow, WINDOW_ATTRS } from '@/state/windows'

import { Window } from '../Window'
import style from './PinnedWindow.module.scss'

export const DEFAULT_PINNED_WINDOW_ZOOM = 0.5

const PinnedWindow_Internal: React.FC = () => {
  const state = useZ((state) => {
    const window = findWindow(state.windows, state.pinnedWindow)
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
      <div
        className={style.container}
        style={{
          width: WINDOW_ATTRS.defaultSize.width,
          height: WINDOW_ATTRS.defaultSize.height,
          scale: DEFAULT_PINNED_WINDOW_ZOOM,
        }}
      >
        <Window id={state.item.id} isFullScreen={false} isPinned={true} />
      </div>
    </FloatingPortal>
  )
}

export const PinnedWindow = React.memo(PinnedWindow_Internal)
