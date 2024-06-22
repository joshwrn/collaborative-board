'use client'
import type { FC } from 'react'
import React from 'react'
import { Windows } from '../Window/Window'

import styles from './Space.module.scss'
import { useAppStore } from '@/state/gen-state'
import { useGestures } from '@/gestures'
import { MdOutlineCenterFocusWeak } from 'react-icons/md'
import { Connections } from '../Connections/Connections'
import { useShallow } from 'zustand/react/shallow'
import { ActiveConnectionGuard } from '../Connections/ActiveConnection'
import { Debug } from '../Debug/Debug'
import { SPACE_ATTRS, resetPan } from '@/state/space'
import { useStore } from '@/state-signia/store'
import { track } from 'signia-react'

const Space_Internal: FC = () => {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const spaceRef = React.useRef<HTMLDivElement>(null)
  // const state = useAppStore(
  //   useShallow((state) => ({
  //     zoom: state.zoom,
  //     pan: state.pan,
  //     setPan: state.setPan,
  //     setZoom: state.setZoom,
  //     setSpaceMousePosition: state.setSpaceMousePosition,
  //     setActiveConnection: state.setActiveConnection,
  //   })),
  // )

  const state = useStore()

  React.useEffect(() => {
    state.space.setPan(resetPan(wrapperRef))
  }, [])

  useGestures({ wrapperRef, spaceRef })
  const lineSize = 1 / state.space.zoom
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
          const x = (e.clientX - rect.left) / state.space.zoom
          const y = (e.clientY - rect.top) / state.space.zoom
          // state.space.setSpaceMousePosition({
          //   x,
          //   y,
          // })
        }}
      >
        <container
          className={styles.container}
          ref={spaceRef}
          // onClick={() => {
          //   state.space.setActiveConnection(null)
          // }}
          style={{
            width: SPACE_ATTRS.size,
            height: SPACE_ATTRS.size,
            transformOrigin: `0 0`,
            transform: `translate(${state.space.pan.x}px, ${state.space.pan.y}px) scale(${state.space.zoom})`,
          }}
        >
          <div
            className={styles.background}
            style={{
              backgroundImage: `linear-gradient(var(--space-grid-color) ${lineSize}px, transparent ${lineSize}px),
          linear-gradient(90deg, var(--space-grid-color) ${lineSize}px, transparent ${lineSize}px)`,
            }}
          />
          <ActiveConnectionGuard />
          <Connections />
          <Windows />
          <Debug />
        </container>
        <button className={styles.button}>
          <MdOutlineCenterFocusWeak
            onClick={() => {
              state.space.setZoom(SPACE_ATTRS.default.zoom)
              state.space.setPan(resetPan(wrapperRef))
            }}
          />
        </button>
      </wrapper>
    </div>
  )
}

export const Space = track(Space_Internal)
