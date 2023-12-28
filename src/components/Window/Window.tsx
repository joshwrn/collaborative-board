'use client'
import type { FC } from 'react'
import React from 'react'

import styles from './Window.module.scss'
import { Email } from '@/state/emails'
import { useAppStore } from '@/state/state'
import { DraggableCore, DraggableData, DraggableEvent } from 'react-draggable'
import { WindowBorder } from './WindowBorder'
import { Connectors } from './Connectors'

export const WindowInternal: FC<{
  email: Email
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
}> = ({ email, position, size, zIndex }) => {
  const { close, zoom, setWindow, bringToFront } = useAppStore((state) => ({
    close: state.toggleOpenWindow,
    zoom: state.zoom,
    setWindow: state.setOneWindow,
    bringToFront: state.reorderWindows,
  }))

  const { width, height } = size

  const nodeRef = React.useRef<HTMLDivElement>(null)

  const onDrag = (e: DraggableEvent, data: DraggableData) => {
    if (!(e instanceof MouseEvent)) return
    const { movementX, movementY } = e
    if (!movementX && !movementY) return
    const scaledPosition = {
      x: movementX / zoom,
      y: movementY / zoom,
    }
    setWindow(email.id, {
      x: position.x + scaledPosition.x,
      y: position.y + scaledPosition.y,
    })
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
          transform: `translate(${position.x}px, ${position.y}px)`,
          width: `${width}px`,
          height: `${height}px`,
          zIndex,
        }}
        onPointerDown={() => bringToFront(email.id)}
      >
        <Connectors id={email.id} />
        <WindowBorder
          width={width}
          height={height}
          id={email.id}
          position={position}
        />
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

const Window = React.memo(WindowInternal)

const WindowsInternal: FC = () => {
  const { emails, windows } = useAppStore((state) => ({
    emails: state.emails,
    windows: state.windows,
  }))
  return (
    <div className={styles.wrapper}>
      {emails.map((email) => {
        const window = windows.find((w) => w.id === email.id)
        if (!window) return null
        return (
          <Window
            key={email.id}
            email={email}
            position={window}
            size={window}
            zIndex={window.zIndex}
          />
        )
      })}
    </div>
  )
}

export const Windows = React.memo(WindowsInternal)
