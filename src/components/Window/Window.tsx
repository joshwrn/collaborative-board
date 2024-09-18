'use client'
import type { FC } from 'react'
import React from 'react'

import { useStore } from '@/state/gen-state'
import { DEFAULT_ITEM, type ItemWithSpecificBody } from '@/state/items'
import type { WindowType } from '@/state/windows'
import { WINDOW_ATTRS } from '@/state/windows'
import { DraggableWindowWrapper } from '@/ui/DraggableWindowWrapper'
import { allowDebugItem } from '@/utils/is-dev'
import { joinClasses } from '@/utils/joinClasses'
import { useOutsideClick } from '@/utils/useOutsideClick'

import { ActivateButton } from './ActivateButton'
import { BranchButton } from './BranchButton'
import { NodeConnections } from './NodeConnections'
import { RotationPoints } from './RotationPoints'
import styles from './Window.module.scss'
import { WindowBody } from './WindowBody'
import { WindowBorder } from './WindowBorder'
import { WindowMenu } from './WindowMenu/WindowMenu'

const WindowInternal: FC<{
  window: WindowType
  isFullScreen: boolean
  isPinned: boolean
}> = ({ window, isFullScreen, isPinned }) => {
  const state = useStore(
    [
      `toggleOpenWindow`,
      `setOneWindow`,
      `reorderWindows`,
      `itemConnections`,
      `setFullScreenWindow`,
      `selectedWindow`,
      `setState`,
      `dev_allowWindowRotation`,
    ],
    (state) => ({
      item: state.items.find((item) => item.id === window.id) ?? DEFAULT_ITEM,
    }),
  )

  const item = React.useMemo(() => state.item, [state.item])

  const nodeRef = React.useRef<HTMLDivElement>(null)

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

  const fromConnections = React.useMemo(
    () => state.itemConnections.filter((c) => c.from === item.id),
    [state.itemConnections, item.id],
  )

  if (item.id === `default_id`) return null

  return (
    <DraggableWindowWrapper
      window={window}
      nodeRef={nodeRef}
      dragProps={{
        disabled: isFullScreen,
      }}
    >
      <div
        ref={nodeRef}
        className={joinClasses(styles.wrapper, `window`)}
        id={`window-${item.id}`}
        style={returnWindowStyle(window, isFullScreen, isPinned)}
        onClick={(e) => {
          e.stopPropagation()
        }}
        onPointerDown={() => {
          state.setState((draft) => {
            draft.selectedWindow = window.id
          })
          state.reorderWindows(window.id)
        }}
      >
        {state.dev_allowWindowRotation && (
          <RotationPoints id={window.id} window={window} />
        )}
        <nav
          className={`${styles.topBar} handle`}
          onDoubleClick={() =>
            state.setFullScreenWindow((prev) => (prev ? null : window.id))
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
              state.toggleOpenWindow(window.id)
            }}
          />
          {!isFullScreen && !isPinned && (
            <button
              className={styles.full}
              onClick={() =>
                state.setFullScreenWindow((prev) => (prev ? null : window.id))
              }
            />
          )}
          {SHOW_ID && <div className={styles.debugId}>{window.id}</div>}
        </nav>

        <header className={styles.titleBar}>
          <section>
            <WindowMenu id={window.id} />
          </section>
          <section className={styles.right}>
            {item.body.type === `generator` && (
              <>
                <BranchButton id={window.id} />
                <section className={styles.connections}>
                  <div>
                    <p>
                      Active <strong>{1}</strong>
                    </p>
                    <p>
                      Open{` `}
                      <strong>{fromConnections.length}</strong>
                    </p>
                  </div>
                </section>
              </>
            )}
            {item.body.type === `generated` && (
              <ActivateButton
                id={window.id}
                isActive={!!item.body.activatedAt}
              />
            )}
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
        {isFullScreen || isPinned ? null : (
          <NodeConnections itemBodyType={item.body.type} id={item.id} />
        )}
        <WindowBorder
          width={window.width}
          height={window.height}
          id={item.id}
          x={window.x}
          y={window.y}
          isFullScreen={isFullScreen}
          isPinned={isPinned}
        />
      </div>
    </DraggableWindowWrapper>
  )
}

export const Window = React.memo(WindowInternal)

const WindowsInternal: FC = () => {
  const state = useStore([`windows`, `fullScreenWindow`])
  return (
    <>
      {state.windows.map((window) => {
        if (state.fullScreenWindow === window.id) return null
        // if (state.pinnedWindow === window.id) return null
        if (!window) return null

        return (
          <Window
            key={window.id}
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
