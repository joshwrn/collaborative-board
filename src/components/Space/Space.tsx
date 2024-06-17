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

const Space_Internal: FC = () => {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const spaceRef = React.useRef<HTMLDivElement>(null)
  const state = useAppStore(
    useShallow((state) => ({
      zoom: state.zoom,
      pan: state.pan,
      setPan: state.setPan,
      setZoom: state.setZoom,
      setSpaceMousePosition: state.setSpaceMousePosition,
      setActiveConnection: state.setActiveConnection,
    })),
  )

  React.useEffect(() => {
    state.setPan(resetPan(wrapperRef))
  }, [])

  useGestures({ wrapperRef, spaceRef })
  const lineSize = 1 / state.zoom
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
              state.setZoom(0.25)
              state.setPan(() => resetPan(wrapperRef))
            }}
          />
        </button>
      </wrapper>
    </div>
  )
}

export const Space = React.memo(Space_Internal)
