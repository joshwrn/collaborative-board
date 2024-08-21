'use client'
import type { FC } from 'react'
import React from 'react'

import { useGestures } from '@/gestures'
import { useStore } from '@/state/gen-state'
import { SPACE_ATTRS } from '@/state/space'

import { Connections } from '../Connections/Connections'
import { SnapLines } from '../SnapLine/SnapLine'
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
    `updateSpaceMousePosition`,
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
          state.updateSpaceMousePosition({
            x: e.clientX,
            y: e.clientY,
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
      </wrapper>
      {state.pinnedWindow && <PinnedWindow />}
      {state.fullScreenWindow && <FullScreenWindow />}
    </div>
  )
}

export const Space = React.memo(Space_Internal)
