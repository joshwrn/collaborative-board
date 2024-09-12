'use client'
import type { FC } from 'react'
import React from 'react'
import { BsTrash3 as TrashIcon } from 'react-icons/bs'
import { match } from 'ts-pattern'

import { useStore } from '@/state/gen-state'
import { useOutsideClick } from '@/utils/useOutsideClick'
import { usePreventScroll } from '@/utils/usePreventScroll'

import styles from './ContextMenu.module.scss'

export const ContextMenu: FC = () => {
  const state = useStore([`contextMenu`, `setState`, `zoom`, `pan`])
  const ref = React.useRef<HTMLDivElement>(null)
  usePreventScroll({ enabled: state.contextMenu !== null })
  useOutsideClick({
    action: () =>
      state.setState((draft) => {
        draft.contextMenu = null
      }),
    refs: [ref],
  })
  if (!state.contextMenu) return null
  return (
    <section
      ref={ref}
      className={styles.container}
      style={{
        left: state.contextMenu.position.x,
        top: state.contextMenu.position.y,
        transformOrigin: `top left`,
      }}
    >
      <MenuItems />
    </section>
  )
}

const MenuItems = () => {
  const state = useStore([
    `contextMenu`,
    `removeConnection`,
    `deleteItem`,
    `createItem`,
    `toggleOpenWindow`,
    `setOneWindow`,
    `setState`,
    `createNewWindow`,
    `organizeWindows`,
    `openAllWindows`,
    `closeAllWindows`,
    `promiseNotification`,
  ])
  if (state.contextMenu === null) return null
  const close = () =>
    state.setState((draft) => {
      draft.contextMenu = null
    })
  return match(state.contextMenu)
    .with({ elementType: `connections` }, (value) => {
      return (
        <div
          className={styles.item}
          onClick={() => {
            state.removeConnection(value.id, `falSettingsConnections`)
            close()
          }}
        >
          <p>Remove</p>
          <TrashIcon />
        </div>
      )
    })
    .with({ elementType: `item` }, (value) => {
      return (
        <div
          className={styles.item}
          onClick={() => {
            state.deleteItem(value.id)
            close()
          }}
        >
          <p>Delete</p>
          <TrashIcon />
        </div>
      )
    })
    .with({ elementType: `space` }, (value) => {
      return (
        <>
          <div
            className={styles.item}
            onClick={() => {
              const id = state.createNewWindow()
              state.setOneWindow(id, {
                x: value.data.x,
                y: value.data.y,
              })

              close()
            }}
          >
            <p>New Window</p>
          </div>
          <div
            className={styles.item}
            onClick={async () => {
              await state.promiseNotification(
                () => {
                  state.organizeWindows()
                },
                {
                  message: `Organizing Windows...`,
                },
                {
                  onFinish: {
                    run: () => {
                      close()
                    },
                  },
                  onSuccess: {
                    update: {
                      message: `Organized Windows`,
                    },
                  },
                },
              )
            }}
          >
            <p>Organize</p>
          </div>
          <div className={styles.divider} />
          <div
            className={styles.item}
            onClick={async () => {
              await state.promiseNotification(
                () => {
                  state.openAllWindows()
                },
                {
                  message: `Opening All Windows...`,
                },
                {
                  onFinish: {
                    run: () => {
                      close()
                    },
                  },
                  onSuccess: {
                    update: {
                      message: `Opened All Windows`,
                    },
                  },
                },
              )
            }}
          >
            <p>Open All</p>
          </div>
          <div
            className={styles.item}
            onClick={async () => {
              await state.promiseNotification(
                () => {
                  state.closeAllWindows()
                },
                {
                  message: `Closing All Windows...`,
                },
                {
                  onFinish: {
                    run: () => {
                      close()
                    },
                  },
                  onSuccess: {
                    update: {
                      message: `Closed All Windows`,
                    },
                  },
                },
              )
            }}
          >
            <p>Close All</p>
          </div>
        </>
      )
    })
    .otherwise(() => null)
}
