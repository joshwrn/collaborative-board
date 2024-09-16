/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client'
import type { FC } from 'react'
import React from 'react'

import { useZ } from '@/state/gen-state'
import { findItem, type ItemWithSpecificBody } from '@/state/items'
import type { WindowType } from '@/state/windows'
import { findWindow, WINDOW_ATTRS } from '@/state/windows'
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
  isFullScreen: boolean
  isPinned: boolean
  window: WindowType
}> = ({ isFullScreen, isPinned, window }) => {
  const { id } = window
  const state = useZ(
    [
      `toggleOpenWindow`,
      `setOneWindow`,
      `reorderWindows`,
      `setFullScreenWindow`,
      `setState`,
      `dev_allowWindowRotation`,
    ],
    (state) => ({
      itemBodyType: findItem(state.items, id)?.body.type,
      isSelected: state.selectedWindow === id,
      fromConnectionsLength: state.itemConnections.filter((c) => c.from === id)
        .length,
    }),
  )

  const nodeRef = React.useRef<HTMLDivElement>(null)

  useOutsideClick({
    refs: [nodeRef],
    selectors: [`#toolbar`, `.dropdown-list`, `.window`],
    action: () => {
      if (state.isSelected) {
        state.setState((draft) => {
          draft.selectedWindow = null
        })
      }
    },
  })

  if (window.id === `default-id`) {
    return null
  }

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
        id={`window-${id}`}
        style={returnWindowStyle(window, isFullScreen, isPinned)}
        onClick={(e) => {
          e.stopPropagation()
        }}
        onPointerDown={() => {
          state.setState((draft) => {
            draft.selectedWindow = id
          })
          state.reorderWindows(id)
        }}
      >
        {state.dev_allowWindowRotation && (
          <RotationPoints id={id} window={window} />
        )}
        <nav
          className={`${styles.topBar} handle`}
          onDoubleClick={() =>
            state.setFullScreenWindow((prev) => (prev ? null : id))
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
              state.toggleOpenWindow(id)
            }}
          />
          {!isFullScreen && !isPinned && (
            <button
              className={styles.full}
              onClick={() =>
                state.setFullScreenWindow((prev) => (prev ? null : id))
              }
            />
          )}
          {SHOW_ID && <div className={styles.debugId}>{window.id}</div>}
        </nav>

        <header className={styles.titleBar}>
          <section>
            <WindowMenu id={id} />
          </section>
          <section className={styles.right}>
            {state.itemBodyType === `generator` && (
              <>
                <BranchButton itemId={id} />
                <section className={styles.connections}>
                  <div>
                    <p>
                      Active <strong>{1}</strong>
                    </p>
                    <p>
                      Open{` `}
                      <strong>{state.fromConnectionsLength}</strong>
                    </p>
                  </div>
                </section>
              </>
            )}
            {state.itemBodyType === `generated` && (
              <ActivateButton itemId={id} />
            )}
          </section>
        </header>

        <main
          className={styles.content}
          style={{
            overflowY: isFullScreen || isPinned ? `auto` : `hidden`,
          }}
        >
          <WindowBody id={id} isPinned={isPinned} />
        </main>
        {isFullScreen || isPinned ? null : <NodeConnections id={id} />}
        <WindowBorder
          window={window}
          isFullScreen={isFullScreen}
          isPinned={isPinned}
        />
      </div>
    </DraggableWindowWrapper>
  )
}

export const Window = React.memo(WindowInternal)

const WindowsInternal: FC = () => {
  const state = useZ([`fullScreenWindow`, `windows`])
  return (
    <>
      {state.windows.map((window) => {
        if (state.fullScreenWindow === window.id) return null
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
