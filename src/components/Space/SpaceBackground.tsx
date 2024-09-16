import React from 'react'

import { useZ } from '@/state/gen-state'

import style from './SpaceBackground.module.scss'

export const SpaceBackground: React.FC = () => {
  const state = useZ([`zoom`, `openContextMenu`])

  return (
    <div
      className={style.wrapper}
      id="space-background"
      onContextMenu={(e) => {
        e.preventDefault()
        state.openContextMenu({ id: `space`, elementType: `space` })
      }}
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        opacity={state.zoom < 0.5 ? state.zoom : 0.5}
      >
        <defs>
          <pattern
            id="dotPattern"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="10" cy="10" r="1" fill="var(--space-grid-color)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotPattern)" />
      </svg>
    </div>
  )
}
