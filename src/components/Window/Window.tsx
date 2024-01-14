'use client'
import type { FC } from 'react'
import React from 'react'

import styles from './Window.module.scss'
import { useAppStore } from '@/state/state'
import { DraggableCore, DraggableData, DraggableEvent } from 'react-draggable'
import { WindowBorder } from './WindowBorder'
import { IoAddOutline } from 'react-icons/io5'
import { ConnectorOverlay } from './ConnectorOverlay'
import { useShallow } from 'zustand/react/shallow'
import { Item } from '@/state/items'

export const WindowInternal: FC<{
  item: Item
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
}> = ({ item, position, size, zIndex }) => {
  const state = useAppStore(
    useShallow((state) => ({
      close: state.toggleOpenWindow,
      zoom: state.zoom,
      setWindow: state.setOneWindow,
      bringToFront: state.reorderWindows,
      connections: state.connections,
      activeConnection: state.activeConnection,
      setActiveConnection: state.setActiveConnection,
      makeConnection: state.makeConnection,
      fullScreen: state.fullscreenWindow,
      setHoveredWindow: state.setHoveredWindow,
    })),
  )

  const { width, height } = size

  const nodeRef = React.useRef<HTMLDivElement>(null)

  const onDrag = (e: DraggableEvent, data: DraggableData) => {
    if (!(e instanceof MouseEvent)) return
    const { movementX, movementY } = e
    if (!movementX && !movementY) return
    const scaledPosition = {
      x: movementX / state.zoom,
      y: movementY / state.zoom,
    }
    state.setWindow(item.id, {
      x: position.x + scaledPosition.x,
      y: position.y + scaledPosition.y,
    })
  }

  const onDragStart = (e: DraggableEvent, data: DraggableData) => {}

  const onDragStop = (e: DraggableEvent, data: DraggableData) => {}

  const toConnections = state.connections.filter((c) => c.to.id === item.id)
  const fromConnections = state.connections.filter((c) => c.from.id === item.id)

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
        onMouseEnter={() => state.setHoveredWindow(item.id)}
        onMouseLeave={() => state.setHoveredWindow(null)}
        onClick={(e) => {
          e.stopPropagation()
        }}
        onPointerDown={() => state.bringToFront(item.id)}
      >
        <WindowBorder
          width={width}
          height={height}
          id={item.id}
          position={position}
        />
        <nav className={`${styles.topBar} handle`}>
          <button
            className={styles.close}
            onClick={() => state.close(item.id)}
          />
          <button
            className={styles.full}
            onClick={() => state.fullScreen(item.id)}
          />
        </nav>

        <header className={styles.titleBar}>
          <section className={styles.title}>
            <h3>{item.from}</h3>
            <p>{item.address}</p>
          </section>
          <section className={styles.connections}>
            <inner>
              <p>
                Incoming <strong>{toConnections.length}</strong>
              </p>
              <p>
                Outgoing <strong>{fromConnections.length}</strong>
              </p>
            </inner>
            <button
              onClick={() =>
                state.setActiveConnection({ from: { id: item.id } })
              }
            >
              <IoAddOutline />
            </button>
          </section>
        </header>
        <main className={styles.content}>
          <p contentEditable={true}>{item.body}</p>
        </main>
        <ConnectorOverlay id={item.id} />
      </div>
    </DraggableCore>
  )
}

const Window = React.memo(WindowInternal)

const WindowsInternal: FC = () => {
  const state = useAppStore(
    useShallow((state) => ({
      items: state.items,
      windows: state.windows,
    })),
  )
  return (
    <>
      {state.items.map((item) => {
        const window = state.windows.find((w) => w.id === item.id)
        if (!window) return null
        return (
          <Window
            key={item.id}
            item={item}
            position={window}
            size={window}
            zIndex={window.zIndex}
          />
        )
      })}
    </>
  )
}

export const Windows = React.memo(WindowsInternal)
