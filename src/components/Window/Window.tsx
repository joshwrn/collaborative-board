'use client'
import type { FC } from 'react'
import React from 'react'
import type { DraggableData, DraggableEvent } from 'react-draggable'
import { DraggableCore } from 'react-draggable'
import { match } from 'ts-pattern'

import { useFullStore, useStore } from '@/state/gen-state'
import type { Item, ItemBody, ItemBodyText } from '@/state/items'
import type { WindowType } from '@/state/windows'
import { WINDOW_ATTRS } from '@/state/windows'
import { joinClasses } from '@/utils/joinClasses'
import { useOutsideClick } from '@/utils/useOutsideClick'

import { Canvas } from '../Canvas/Canvas'
import { GenerateButton } from './GenerateButton'
import { LoadingOverlay } from './LoadingOverlay'
import { RandomizePromptButton } from './RandomizePromptButton'
import { RotationPoints } from './RotationPoints'
import styles from './Window.module.scss'
import { WindowBorder } from './WindowBorder'
import { WindowMenu } from './WindowMenu/WindowMenu'

const Text = ({
  textRef,
  windowId,
  contentId,
}: {
  textRef: React.MutableRefObject<string>
  windowId: string
  contentId: string
}) => {
  const ref = React.useRef<HTMLParagraphElement>(null)
  const state = useStore([`editItemContent`, `editItem`])

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
          type: `text`,
          content: ref.current.innerText,
          id: contentId,
        })
      }}
    >
      {textRef.current}
    </p>
  )
}

const Prompt: React.FC<{ value: ItemBodyText; windowId: string }> = ({
  value,
  windowId,
}) => {
  const textRef = React.useRef(value.content)
  return (
    <div className={styles.textContainer}>
      <header>
        <h2>Prompt</h2>
        <RandomizePromptButton
          windowId={windowId}
          contentId={value.id}
          textRef={textRef}
        />
      </header>
      <Text
        textRef={textRef}
        key={value.id}
        windowId={windowId}
        contentId={value.id}
      />
    </div>
  )
}

const matchBody = (
  body: ItemBody,
  i: number,
  window: WindowType,
  isPinned: boolean,
): JSX.Element | JSX.Element[] | null => {
  return match(body)
    .with({ type: `canvas` }, (value) => (
      <Canvas
        isPinned={isPinned}
        key={i}
        window={window}
        contentId={body.id}
        content={value.content}
      />
    ))
    .with({ type: `text` }, (value) => {
      return <Prompt key={i} value={value} windowId={window.id} />
    })
    .otherwise(() => null)
}

const returnWindowStyle = (
  window: WindowType,
  isFullScreen: boolean,
  isPinned?: boolean,
): React.CSSProperties => {
  if (isFullScreen) {
    return {
      left: 0,
      top: 0,
      position: `relative`,
      width: WINDOW_ATTRS.defaultFullScreenSize.width + `px`,
      height: WINDOW_ATTRS.defaultFullScreenSize.height + `px`,
      rotate: `0deg`,
      zIndex: `var(--fullscreen-window-z-index)`,
    }
  }
  if (isPinned) {
    return {
      left: 0,
      top: 0,
      position: `relative`,
      width: WINDOW_ATTRS.defaultSize.width + `px`,
      height: WINDOW_ATTRS.defaultSize.height + `px`,
      rotate: `0deg`,
    }
  }
  return {
    left: window.x,
    top: window.y,
    // transformOrigin: '0 0',
    width: `${window.width}px`,
    height: `${window.height}px`,
    rotate: `${window.rotation}deg`,
    zIndex: window.zIndex,
  }
}

const WindowInternal: FC<{
  item: Item
  window: WindowType
  isFullScreen: boolean
  isPinned: boolean
}> = ({ item, window, isFullScreen, isPinned }) => {
  const state = useStore([
    `toggleOpenWindow`,
    `setOneWindow`,
    `reorderWindows`,
    `connections`,
    `makeConnection`,
    `setFullScreenWindow`,
    `snapToWindows`,
    `setSnapLines`,
    `zoom`,
    `selectedWindow`,
    `setState`,
    `dev_allowWindowRotation`,
    `generatingCanvas`,
  ])

  const realPosition = React.useRef({ x: window.x, y: window.y })
  const nodeRef = React.useRef<HTMLDivElement>(null)

  const { width, height } = window

  useOutsideClick({
    refs: [nodeRef],
    selectors: [`#toolbar`, `.dropdown-list`],
    action: () => {
      if (state.selectedWindow === item.id) {
        state.setState((draft) => {
          draft.selectedWindow = null
        })
      }
    },
  })

  const onDrag = (e: DraggableEvent, data: DraggableData) => {
    if (!(e instanceof MouseEvent)) return
    const { movementX, movementY } = e
    if (!movementX && !movementY) return
    const { zoom } = useFullStore.getState()
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

  const onDragStop = (e: DraggableEvent, data: DraggableData) => {
    state.setSnapLines([])
  }

  const canvasesLoading = React.useMemo(
    () =>
      state.generatingCanvas.filter((c) => c.generatedFromItemId === item.id),
    [state.generatingCanvas, item.id],
  )

  const fromConnections = React.useMemo(
    () => state.connections.filter((c) => c.from === item.id),
    [state.connections, item.id],
  )

  return (
    <DraggableCore
      onDrag={onDrag}
      onStop={onDragStop}
      handle=".handle"
      nodeRef={nodeRef}
      disabled={isFullScreen}
    >
      <div
        ref={nodeRef}
        className={joinClasses(styles.wrapper, `window`)}
        id={`window-${item.id}`}
        style={returnWindowStyle(window, isFullScreen, isPinned)}
        onMouseEnter={() => {
          state.setState((draft) => {
            draft.hoveredWindow = item.id
          })
        }}
        onMouseLeave={() => {
          state.setState((draft) => {
            draft.hoveredWindow = null
          })
        }}
        onClick={(e) => {
          e.stopPropagation()
        }}
        onPointerDown={() => {
          state.setState((draft) => {
            draft.selectedWindow = item.id
          })
          state.reorderWindows(item.id)
        }}
      >
        {state.dev_allowWindowRotation && (
          <RotationPoints id={item.id} window={window} />
        )}
        <nav
          className={`${styles.topBar} handle`}
          onDoubleClick={() =>
            state.setFullScreenWindow((prev) => (prev ? null : item.id))
          }
        >
          <button
            className={styles.close}
            onClick={() => {
              if (isPinned) {
                state.setState((draft) => {
                  draft.pinnedWindow = null
                })
                return
              }
              if (isFullScreen) {
                state.setFullScreenWindow(null)
                return
              }
              state.setState((draft) => {
                draft.selectedWindow = null
              })
              state.toggleOpenWindow(item.id)
            }}
          />
          {!isFullScreen && !isPinned && (
            <button
              className={styles.full}
              onClick={() =>
                state.setFullScreenWindow((prev) => (prev ? null : item.id))
              }
            />
          )}
        </nav>

        <header className={styles.titleBar}>
          <section>
            <WindowMenu id={item.id} />
          </section>
          <section className={styles.right}>
            <GenerateButton item={item} />
            <section className={styles.connections}>
              <div>
                <p>
                  Loading <strong>{canvasesLoading.length}</strong>
                </p>
                <p>
                  Finished <strong>{fromConnections.length}</strong>
                </p>
              </div>
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
            overflowY: isFullScreen || isPinned ? `auto` : `hidden`,
          }}
        >
          {item.body.map((body, i) => matchBody(body, i, window, !!isPinned))}
        </main>
        <LoadingOverlay itemId={item.id} />

        <WindowBorder
          width={width}
          height={height}
          id={item.id}
          position={{ x: window.x, y: window.y }}
          isFullScreen={isFullScreen}
          isPinned={isPinned}
        />
      </div>
    </DraggableCore>
  )
}

export const Window = React.memo(WindowInternal)

const WindowsInternal: FC = () => {
  const state = useStore([
    `items`,
    `windows`,
    `fullScreenWindow`,
    `pinnedWindow`,
  ])
  const itemsMap = React.useMemo(
    () =>
      state.items.reduce<Record<string, Item>>((acc, item) => {
        acc[item.id] = item
        return acc
      }, {}),
    [state.items],
  )
  return (
    <>
      {state.windows.map((window) => {
        const item = itemsMap[window.id]
        if (state.fullScreenWindow === window.id) return null
        // if (state.pinnedWindow === window.id) return null
        if (!window) return null
        if (!item) return null
        return (
          <Window
            key={item.id}
            item={item}
            window={window}
            isFullScreen={false}
            isPinned={false}
          />
        )
      })}
    </>
  )
}

export const Windows = React.memo(WindowsInternal)
