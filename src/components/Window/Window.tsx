'use client'
import type { FC } from 'react'
import React from 'react'

import { useDragControls, motion } from 'framer-motion'
import styles from './Window.module.scss'
import { Email } from '@/state/emails'
import { useAppStore } from '@/state/state'
import {
  DraggableCore,
  DraggableData,
  DraggableEvent,
  DraggableEventHandler,
} from 'react-draggable'

export const WindowInternal: FC<{
  email: Email
}> = ({ email }) => {
  const { close, zoom } = useAppStore((state) => ({
    close: state.toggleOpenEmail,
    zoom: state.zoom,
  }))
  const [position, setPosition] = React.useState({
    x: 0,
    y: 0,
  })
  const nodeRef = React.useRef<HTMLDivElement>(null)

  const width = 700
  const height = 500

  const onDrag = (e: DraggableEvent, data: DraggableData) => {
    if (!(e instanceof MouseEvent)) return
    const { movementX, movementY } = e
    if (!movementX && !movementY) return
    const scaledPosition = {
      x: movementX / zoom,
      y: movementY / zoom,
    }
    setPosition((prev) => ({
      x: prev.x + scaledPosition.x,
      y: prev.y + scaledPosition.y,
    }))
  }

  const onDragStart = (e: DraggableEvent, data: DraggableData) => {
    console.log('drag start')
  }

  const onDragStop = (e: DraggableEvent, data: DraggableData) => {
    console.log('drag stop')
  }

  return (
    <DraggableCore
      onDrag={onDrag}
      onStop={onDragStop}
      onStart={onDragStart}
      handle=".handle"
      nodeRef={nodeRef}
    >
      <div
        ref={nodeRef}
        className={styles.wrapper}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        <nav className={`${styles.topBar} handle`}>
          <button className={styles.close} onClick={() => close(email.id)} />
          <button className={styles.full} />
        </nav>

        <header className={styles.titleBar}>
          <h3>{email.from}</h3>
          <p>{email.address}</p>
        </header>
        <main className={styles.content}>
          <p>{email.body}</p>
        </main>
      </div>
    </DraggableCore>
  )
}

export const Window = React.memo(WindowInternal)
