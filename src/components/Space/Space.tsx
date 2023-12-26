'use client'
import type { FC } from 'react'
import React from 'react'
import { Window } from '../Window/Window'

import styles from './Space.module.scss'
import { useAppStore } from '@/state/state'
import { useGestures } from '@/gestures'
import { MdOutlineCenterFocusWeak } from 'react-icons/md'

export const Space: FC = () => {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const state = useAppStore((state) => ({
    zoom: state.zoom,
    pan: state.pan,
    setPan: state.setPan,
    setZoom: state.setZoom,
    emails: state.emails,
    openEmails: state.openEmails,
    windowPositions: state.windowPositions,
    windowSizes: state.windowSizes,
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
        {state.openEmails.map((id) => {
          const email = state.emails.find((email) => email.id === id)
          if (!email) return null
          return (
            <Window
              key={email.id}
              email={email}
              position={
                state.windowPositions.find((p) => p.id === email.id) || {
                  x: 0,
                  y: 0,
                }
              }
              size={
                state.windowSizes.find((s) => s.id === email.id) || {
                  width: 100,
                  height: 100,
                }
              }
            />
          )
        })}
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
