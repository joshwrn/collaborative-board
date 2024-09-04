'use client'
import type { FC } from 'react'
import React from 'react'
import type { DraggableData, DraggableEvent } from 'react-draggable'
import { DraggableCore } from 'react-draggable'

import { useFullStore, useStore } from '@/state/gen-state'
import type { Item } from '@/state/items'
import type { WindowType } from '@/state/windows'
import { WINDOW_ATTRS } from '@/state/windows'
import { allowDebugItem } from '@/utils/is-dev'
import { joinClasses } from '@/utils/joinClasses'
import { useOutsideClick } from '@/utils/useOutsideClick'

import { GenerateButton } from './GenerateButton'
import { LoadingOverlay } from './LoadingOverlay'
import { RotationPoints } from './RotationPoints'
import styles from './Window.module.scss'
import { WindowBody } from './WindowBody'
import { WindowBorder } from './WindowBorder'
import { WindowMenu } from './WindowMenu/WindowMenu'

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
    `loadingCanvases`,
    `hasOrganizedWindows`,
  ])

  const realPosition = React.useRef({ x: window.x, y: window.y })
  const nodeRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    realPosition.current = { x: window.x, y: window.y }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.hasOrganizedWindows])

  useOutsideClick({
    refs: [nodeRef],
    selectors: [`#toolbar`, `.dropdown-list`, `.window`],
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
    realPosition.current = {
      x: realPosition.current.x + scaledPosition.x,
      y: realPosition.current.y + scaledPosition.y,
    }
    state.snapToWindows(item.id, {
      ...window,
      ...realPosition.current,
    })
  }

  const onDragStop = (e: DraggableEvent, data: DraggableData) => {
    state.setSnapLines([])
  }

  const canvasesLoading = React.useMemo(
    () => state.loadingCanvases.filter((c) => c.generatedFromItemId === item.id),
    [state.loadingCanvases, item.id],
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
          {SHOW_ID && <div className={styles.debugId}>{window.id}</div>}
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
                  Finished{` `}
                  <strong>
                    {fromConnections.length - canvasesLoading.length}
                  </strong>
                </p>
              </div>
            </section>
          </section>
        </header>

        <main
          className={styles.content}
          style={{
            overflowY: isFullScreen || isPinned ? `auto` : `hidden`,
          }}
        >
          <WindowBody item={item} window={window} isPinned={isPinned} />
        </main>
        <LoadingOverlay itemId={item.id} />

        <WindowBorder
          width={window.width}
          height={window.height}
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
    width: `${window.width}px`,
    height: `${window.height}px`,
    rotate: `${window.rotation}deg`,
    zIndex: window.zIndex,
  }
}

const SHOW_ID = allowDebugItem(false)
