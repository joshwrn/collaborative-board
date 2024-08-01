'use client'
import type { FC } from 'react'
import React from 'react'
import { Windows } from '../Window/Window'

import styles from './Space.module.scss'
import { useShallowAppStore } from '@/state/gen-state'
import { useGestures } from '@/gestures'
import { Connections } from '../Connections/Connections'
import { ActiveConnectionGuard } from '../Connections/ActiveConnection'
import { Debug } from '../Debug/Debug'
import { SPACE_ATTRS } from '@/state/space'
import { SnapLines } from '../SnapLine/SnapLine'
import { Toolbar } from '../Toolbar/Toolbar'
import { FullScreenWindow } from '../Window/FullScreenWindow/FullScreenWindow'
import { dotBackground } from './dotBackground'

const Space_Internal: FC = () => {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const spaceRef = React.useRef<HTMLDivElement>(null)
  const state = useShallowAppStore([
    'zoom',
    'pan',
    'setSpaceMousePosition',
    'setActiveConnection',
    'fullScreenWindow',
    'openContextMenu',
  ])

  useGestures({ wrapperRef, spaceRef })
  return (
    <div className={styles.outer}>
      <wrapper
        ref={wrapperRef}
        className={styles.wrapper}
        onContextMenu={(e) => {
          e.preventDefault()
        }}
        onMouseMove={(e) => {
          const rect = spaceRef.current?.getBoundingClientRect() ?? {
            left: 0,
            top: 0,
          }
          const x = (e.clientX - rect.left) / state.zoom
          const y = (e.clientY - rect.top) / state.zoom
          state.setSpaceMousePosition({
            x,
            y,
          })
        }}
      >
        <container
          className={styles.container}
          ref={spaceRef}
          onClick={() => {
            state.setActiveConnection(null)
          }}
          style={{
            width: SPACE_ATTRS.size,
            height: SPACE_ATTRS.size,
            transformOrigin: `0 0`,
            transform: `translate(${state.pan.x}px, ${state.pan.y}px) scale(${state.zoom})`,
          }}
        >
          <div
            onContextMenu={(e) => {
              state.openContextMenu({ id: 'space', elementType: 'space' })
            }}
            className={styles.background}
            style={{
              background: dotBackground({ zoom: state.zoom }),
            }}
          />
          <ActiveConnectionGuard />
          <Connections />
          <Windows />
          <SnapLines />
          <Debug />
        </container>
        <Toolbar />
      </wrapper>
      {state.fullScreenWindow && <FullScreenWindow />}
    </div>
  )
}

export const Space = React.memo(Space_Internal)
