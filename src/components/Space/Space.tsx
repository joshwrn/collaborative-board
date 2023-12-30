'use client'
import type { FC } from 'react'
import React from 'react'
import { Windows } from '../Window/Window'

import styles from './Space.module.scss'
import { useAppStore } from '@/state/state'
import { useGestures } from '@/gestures'
import { MdOutlineCenterFocusWeak } from 'react-icons/md'
import { Connections } from '../Connections/Connections'

export const Space: FC = () => {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const state = useAppStore((state) => ({
    zoom: state.zoom,
    pan: state.pan,
    setPan: state.setPan,
    setZoom: state.setZoom,
  }))
  useGestures({ wrapperRef })
  return (
    <wrapper ref={wrapperRef} className={styles.wrapper}>
      <container
        className={styles.container}
        style={{
          transform: `scale(${state.zoom}) translate(${state.pan.x}px, ${state.pan.y}px)`,
        }}
      >
        <Connections />
        <Windows />
        {/* <overlay className={styles.overlay} /> */}
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
