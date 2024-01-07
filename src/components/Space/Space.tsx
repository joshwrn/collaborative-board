'use client'
import type { FC } from 'react'
import React from 'react'
import { Windows } from '../Window/Window'

import styles from './Space.module.scss'
import { useAppStore } from '@/state/state'
import { useGestures } from '@/gestures'
import { MdOutlineCenterFocusWeak } from 'react-icons/md'
import { Connections } from '../Connections/Connections'
import { ContextMenu } from '../ContextMenu/ContextMenu'

export const Space: FC = () => {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const spaceRef = React.useRef<HTMLDivElement>(null)
  const state = useAppStore((state) => ({
    zoom: state.zoom,
    pan: state.pan,
    setPan: state.setPan,
    setZoom: state.setZoom,
    setMousePosition: state.setMousePosition,
    setActiveConnection: state.setActiveConnection,
  }))
  useGestures({ wrapperRef })
  return (
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
        state.setMousePosition({
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
          transform: `scale(${state.zoom}) translate(${state.pan.x}px, ${state.pan.y}px)`,
        }}
      >
        <Connections />
        <Windows />
        <ContextMenu />
      </container>
      <button className={styles.button}>
        <MdOutlineCenterFocusWeak
          onClick={() => {
            state.setZoom(1)
            state.setPan({ x: 0, y: 0 })
          }}
        />
      </button>
    </wrapper>
  )
}
