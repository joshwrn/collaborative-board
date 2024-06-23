'use client'
import type { FC } from 'react'
import React from 'react'

import styles from './Window.module.scss'
import { useAppStore } from '@/state/gen-state'
import { DraggableCore, DraggableData, DraggableEvent } from 'react-draggable'
import { WindowBorder } from './WindowBorder'
import { IoAddOutline } from 'react-icons/io5'
import { ConnectorOverlay } from './ConnectorOverlay'
import { useShallow } from 'zustand/react/shallow'
import { Iframe, Item } from '@/state/items'
import { WindowType } from '@/state/windows'
import { match, P } from 'ts-pattern'
import { joinClasses } from '@/utils/joinClasses'

const matchBody = (
  body: string | Iframe,
  i: number,
): JSX.Element | JSX.Element[] | null => {
  return match(body)
    .with(P.string, (value) => <p key={i}>{value}</p>)
    .with(
      {
        src: P.string,
      },
      (value) => (
        <div
          style={{
            width: '100%',
            height: '100%',
          }}
          key={i}
        >
          <iframe
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '10px',
            }}
            {...value}
          />
        </div>
      ),
    )
    .otherwise(() => null)
}

export const WindowInternal: FC<{
  item: Item
  window: WindowType
}> = ({ item, window }) => {
  const state = useAppStore(
    useShallow((state) => ({
      close: state.toggleOpenWindow,
      setWindow: state.setOneWindow,
      bringToFront: state.reorderWindows,
      connections: state.connections,
      setActiveConnection: state.setActiveConnection,
      makeConnection: state.makeConnection,
      fullScreen: state.fullscreenWindow,
      setHoveredWindow: state.setHoveredWindow,
      snapToWindows: state.snapToWindows,
    })),
  )

  const realPosition = React.useRef({ x: window.x, y: window.y })

  const { width, height } = window

  const nodeRef = React.useRef<HTMLDivElement>(null)

  const onDrag = (e: DraggableEvent, data: DraggableData) => {
    if (!(e instanceof MouseEvent)) return
    const { movementX, movementY } = e
    if (!movementX && !movementY) return
    const scaledPosition = {
      x: movementX / useAppStore.getState().zoom,
      y: movementY / useAppStore.getState().zoom,
    }
    realPosition.current.x += scaledPosition.x
    realPosition.current.y += scaledPosition.y
    state.snapToWindows(item.id, {
      ...window,
      x: realPosition.current.x,
      y: realPosition.current.y,
    })
  }

  const onDragStart = (e: DraggableEvent, data: DraggableData) => {}

  const onDragStop = (e: DraggableEvent, data: DraggableData) => {}

  const toConnections = React.useMemo(
    () => state.connections.filter((c) => c.to === item.id),
    [state.connections, item.id],
  )

  const fromConnections = React.useMemo(
    () => state.connections.filter((c) => c.from === item.id),
    [state.connections, item.id],
  )

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
        className={joinClasses(styles.wrapper, 'window')}
        id={`window-${item.id}`}
        style={{
          left: window.x,
          top: window.y,
          width: `${width}px`,
          height: `${height}px`,
          zIndex: window.zIndex,
        }}
        onMouseEnter={() => state.setHoveredWindow(item.id)}
        onMouseLeave={() => state.setHoveredWindow(null)}
        onClick={(e) => {
          e.stopPropagation()
        }}
        onPointerDown={() => state.bringToFront(item.id)}
      >
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
          <section className={styles.title}></section>
          <section className={styles.connections}>
            <inner>
              <p>
                Incoming <strong>{toConnections.length}</strong>
              </p>
              <p>
                Outgoing <strong>{fromConnections.length}</strong>
              </p>
            </inner>
            <button onClick={() => state.setActiveConnection({ from: item.id })}>
              <IoAddOutline />
            </button>
          </section>
        </header>

        <main className={styles.content}>
          {item.body.map((body, i) => matchBody(body, i))}
        </main>
        <ConnectorOverlay id={item.id} />

        <WindowBorder
          width={width}
          height={height}
          id={item.id}
          position={{ x: window.x, y: window.y }}
        />
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
  const itemsMap = React.useMemo(
    () =>
      state.items.reduce((acc, item) => {
        acc[item.id] = item
        return acc
      }, {} as Record<string, Item>),
    [state.items],
  )
  return (
    <>
      {state.windows.map((window) => {
        const item = itemsMap[window.id]
        if (!window) return null
        return <Window key={item.id} item={item} window={window} />
      })}
    </>
  )
}

export const Windows = React.memo(WindowsInternal)
