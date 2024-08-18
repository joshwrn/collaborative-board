'use client'
import type { FC } from 'react'
import React from 'react'

import { useGestures } from '@/gestures'
import { useStore } from '@/state/gen-state'
import { SPACE_ATTRS } from '@/state/space'

import { Connections } from '../Connections/Connections'
import { SnapLines } from '../SnapLine/SnapLine'
import { Toolbar } from '../Toolbar/Toolbar'
import { FullScreenWindow } from '../Window/FullScreenWindow/FullScreenWindow'
import { PinnedWindow } from '../Window/PinnedWindow/PinnedWindow'
import { Windows } from '../Window/Window'
import styles from './Space.module.scss'
import { SpaceBackground } from './SpaceBackground'

const Space_Internal: FC = () => {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const spaceRef = React.useRef<HTMLDivElement>(null)
  const state = useStore([
    `zoom`,
    `pan`,
    `setSpaceMousePosition`,
    `fullScreenWindow`,
    `openContextMenu`,
    `setState`,
    `pinnedWindow`,
  ])

  useGestures({ wrapperRef, spaceRef })
  return (
    <div className={styles.outer}>
      <wrapper
        ref={wrapperRef}
        className={styles.wrapper}
        onMouseMove={(e) => {
          const left = SPACE_ATTRS.size.default / 2 - state.pan.x
          const top = SPACE_ATTRS.size.default / 2 - state.pan.y
          const x = left
          const y = top
          const distFromCenterX = window.innerWidth / 2 - e.clientX
          const distFromCenterY = window.innerHeight / 2 - e.clientY
          // 5 = (padding / 2). 22 = (toolbar height / 2)
          const x2 = x - distFromCenterX + 5
          const y2 = y - distFromCenterY - 22
          state.setSpaceMousePosition({
            x: x2 / state.zoom,
            y: y2 / state.zoom,
          })
        }}
      >
        <container
          className={styles.container}
          ref={spaceRef}
          onClick={() => {
            state.setState((draft) => {
              draft.activeConnection = null
            })
          }}
          style={{
            width: SPACE_ATTRS.size.default,
            height: SPACE_ATTRS.size.default,
            // order is important
            transformOrigin: `0 0`,
            transform: `translate(${state.pan.x}px, ${state.pan.y}px) scale(${state.zoom})`,
          }}
        >
          <SpaceBackground />
          <Connections />
          <Windows />
          <SnapLines />
          {/* <Debug /> */}
        </container>
        <Toolbar />
      </wrapper>
      {state.pinnedWindow && <PinnedWindow />}
      {state.fullScreenWindow && <FullScreenWindow />}
    </div>
  )
}

export const Space = React.memo(Space_Internal)
