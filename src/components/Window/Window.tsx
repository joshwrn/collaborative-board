'use client'
import type { FC } from 'react'
import React from 'react'

import styles from './Window.module.scss'
import { useFullStore, useStore } from '@/state/gen-state'
import { DraggableCore, DraggableData, DraggableEvent } from 'react-draggable'
import { WindowBorder } from './WindowBorder'
import { ConnectorOverlay } from './ConnectorOverlay'
import { Item, ItemBody } from '@/state/items'
import { WINDOW_ATTRS, WindowType } from '@/state/windows'
import { match } from 'ts-pattern'
import { joinClasses } from '@/utils/joinClasses'
import { Canvas } from '../Canvas/Canvas'
import { useOutsideClick } from '@/utils/useOutsideClick'
import { GenerateButton } from './GenerateButton'
import { LoadingOverlay } from './LoadingOverlay'

const Text = ({
  content,
  windowId,
  contentId,
}: {
  content: string
  windowId: string
  contentId: string
}) => {
  const ref = React.useRef<HTMLParagraphElement>(null)
  const state = useStore(['editItemContent', 'editItem'])
  const textRef = React.useRef(content)
  return (
    <p
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onInput={() => {
        if (!ref.current) return
        state.editItem(windowId, {
          subject: ref.current.innerText,
        })
        state.editItemContent(windowId, {
          type: 'text',
          content: ref.current.innerText,
          id: contentId,
        })
      }}
    >
      {textRef.current}
    </p>
  )
}

const matchBody = (
  body: ItemBody,
  i: number,
  window: WindowType,
): JSX.Element | JSX.Element[] | null => {
  return match(body)
    .with({ type: 'canvas' }, (value) => (
      <Canvas
        key={i}
        window={window}
        contentId={body.id}
        content={value.content}
      />
    ))
    .with({ type: 'text' }, (value) => (
      <div className={styles.textContainer}>
        <h2>Prompt</h2>
        <Text
          key={i}
          content={value.content}
          windowId={window.id}
          contentId={body.id}
        />
      </div>
    ))
    .with(
      {
        type: 'iframe',
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
            {...value.content}
          />
        </div>
      ),
    )
    .otherwise(() => null)
}

const WindowInternal: FC<{
  item: Item
  window: WindowType
  isFullScreen: boolean
}> = ({ item, window, isFullScreen }) => {
  const state = useStore([
    'toggleOpenWindow',
    'setOneWindow',
    'reorderWindows',
    'connections',
    'setActiveConnection',
    'makeConnection',
    'setFullScreenWindow',
    'setHoveredWindow',
    'snapToWindows',
    'setSnapLines',
    'spaceMousePosition',
    'zoom',
    'setSelectedWindow',
    'selectedWindow',
  ])

  const realPosition = React.useRef({ x: window.x, y: window.y })
  const nodeRef = React.useRef<HTMLDivElement>(null)

  const { width, height } = window

  useOutsideClick({
    refs: [nodeRef],
    selectors: ['#toolbar', '.dropdown-list'],
    action: () => {
      if (state.selectedWindow === item.id) {
        state.setSelectedWindow(null)
      }
    },
  })

  const onDrag = (e: DraggableEvent, data: DraggableData) => {
    if (!(e instanceof MouseEvent)) return
    const { movementX, movementY } = e
    if (!movementX && !movementY) return
    const zoom = useFullStore.getState().zoom
    const scaledPosition = {
      x: movementX / zoom,
      y: movementY / zoom,
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

  const onDragStop = (e: DraggableEvent, data: DraggableData) => {
    state.setSnapLines([])
  }

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
      disabled={isFullScreen}
    >
      <div
        ref={nodeRef}
        className={joinClasses(styles.wrapper, 'window')}
        id={`window-${item.id}`}
        style={{
          ...(isFullScreen
            ? {
                left: 0,
                top: 0,
                position: 'relative',
                width: WINDOW_ATTRS.defaultFullScreenSize.width + 'px',
                height: WINDOW_ATTRS.defaultFullScreenSize.height + 'px',
                rotate: '0deg',
                zIndex: 'var(--fullscreen-window-z-index)',
              }
            : {
                left: window.x,
                top: window.y,
                // transformOrigin: '0 0',
                width: `${window.width}px`,
                height: `${window.height}px`,
                rotate: `${window.rotation}deg`,
                zIndex: window.zIndex,
              }),
        }}
        onMouseEnter={() => state.setHoveredWindow(item.id)}
        onMouseLeave={() => state.setHoveredWindow(null)}
        onClick={(e) => {
          e.stopPropagation()
        }}
        onPointerDown={() => {
          state.setSelectedWindow(item.id)
          state.reorderWindows(item.id)
        }}
      >
        {/* <RotationPoints id={item.id} window={window} /> */}
        <nav
          className={`${styles.topBar} handle`}
          onDoubleClick={() =>
            state.setFullScreenWindow((prev) => (prev ? null : item.id))
          }
        >
          <button
            className={styles.close}
            onClick={() => {
              state.setFullScreenWindow(null)
              state.toggleOpenWindow(item.id)
            }}
          />
          <button
            className={!isFullScreen ? styles.full : styles.min}
            onClick={() =>
              state.setFullScreenWindow((prev) => (prev ? null : item.id))
            }
          />
        </nav>

        <header className={styles.titleBar}>
          <section>{/* <WindowMenu id={item.id} /> */}</section>
          <section className={styles.right}>
            <GenerateButton item={item} />
            <section className={styles.connections}>
              <inner>
                <p>
                  Incoming <strong>{toConnections.length}</strong>
                </p>
                <p>
                  Outgoing <strong>{fromConnections.length}</strong>
                </p>
              </inner>
              {/* <button
                onClick={() => state.setActiveConnection({ from: item.id })}
              >
                <IoAddOutline />
              </button> */}
            </section>
          </section>
        </header>

        <main
          className={styles.content}
          style={{
            overflowY: isFullScreen ? 'auto' : 'hidden',
          }}
        >
          {item.body.map((body, i) => matchBody(body, i, window))}
        </main>
        <ConnectorOverlay id={item.id} />
        <LoadingOverlay itemId={item.id} />

        <WindowBorder
          width={width}
          height={height}
          id={item.id}
          position={{ x: window.x, y: window.y }}
          isFullScreen={isFullScreen}
        />
      </div>
    </DraggableCore>
  )
}

export const Window = React.memo(WindowInternal)

const WindowsInternal: FC = () => {
  const state = useStore(['items', 'windows', 'fullScreenWindow'])
  const itemsMap = React.useMemo(
    () =>
      state.items.reduce(
        (acc, item) => {
          acc[item.id] = item
          return acc
        },
        {} as Record<string, Item>,
      ),
    [state.items],
  )
  return (
    <>
      {state.windows.map((window) => {
        const item = itemsMap[window.id]
        if (state.fullScreenWindow === window.id) return null
        if (!window) return null
        if (!item) return null
        return (
          <Window
            key={item.id}
            item={item}
            window={window}
            isFullScreen={false}
          />
        )
      })}
    </>
  )
}

export const Windows = React.memo(WindowsInternal)
