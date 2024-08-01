'use client'
import type { FC } from 'react'
import React from 'react'
import styles from './ContextMenu.module.scss'
import { useShallowAppStore } from '@/state/gen-state'
import { useOutsideClick } from '@/utils/useOutsideClick'
import { BsTrash3 as TrashIcon } from 'react-icons/bs'
import { usePreventScroll } from '@/utils/usePreventScroll'
import { match } from 'ts-pattern'
import { nanoid } from 'nanoid'
import { createMockPrompt } from '@/mock/mock-items'

export const ContextMenu: FC = () => {
  const state = useShallowAppStore([
    'contextMenu',
    'setContextMenu',
    'zoom',
    'pan',
  ])
  const ref = React.useRef<HTMLDivElement>(null)
  usePreventScroll({ enabled: state.contextMenu !== null })
  useOutsideClick({ action: () => state.setContextMenu(null), refs: [ref] })
  if (!state.contextMenu) return null
  return (
    <container
      ref={ref}
      className={styles.container}
      style={{
        left: state.contextMenu.position.x,
        top: state.contextMenu.position.y,
        transformOrigin: 'top left',
      }}
    >
      <MenuItems />
    </container>
  )
}

const MenuItems = () => {
  const state = useShallowAppStore([
    'contextMenu',
    'setContextMenu',
    'removeConnection',
    'deleteItem',
    'createItem',
    'toggleOpenWindow',
    'setOneWindow',
  ])
  if (state.contextMenu === null) return null
  const close = () => state.setContextMenu(null)
  return match(state.contextMenu)
    .with({ elementType: 'connections' }, (value) => {
      return (
        <item
          className={styles.item}
          onClick={() => {
            state.removeConnection(value.id ?? '')
            close()
          }}
        >
          <p>Delete</p>
          <TrashIcon />
        </item>
      )
    })
    .with({ elementType: 'item' }, (value) => {
      console.log('value:', value)
      return (
        <item
          className={styles.item}
          onClick={() => {
            state.deleteItem(value.id ?? '')
            close()
          }}
        >
          <p>Delete</p>
          <TrashIcon />
        </item>
      )
    })
    .with({ elementType: 'space' }, (value) => {
      return (
        <item
          className={styles.item}
          onClick={() => {
            const id = nanoid()
            state.createItem({
              id: id,
              body: [
                {
                  id: nanoid(),
                  type: 'text',
                  content: createMockPrompt(),
                },
                {
                  id: nanoid(),
                  type: 'canvas',
                  content: {
                    base64: '',
                  },
                },
              ],
            })
            state.toggleOpenWindow(id)
            state.setOneWindow(id, {
              x: value.data.x,
              y: value.data.y,
            })
            close()
          }}
        >
          <p>New Window</p>
        </item>
      )
    })
    .otherwise(() => null)
}
