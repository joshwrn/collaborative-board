'use client'
import type { FC } from 'react'
import React from 'react'
import styles from './ContextMenu.module.scss'
import { useAppStore } from '@/state/gen-state'
import { useOutsideClick } from '@/utils/useOutsideClick'
import { BsTrash3 as TrashIcon } from 'react-icons/bs'
import { usePreventScroll } from '@/utils/usePreventScroll'
import { useShallow } from 'zustand/react/shallow'

export const ContextMenu: FC = () => {
  const state = useAppStore(
    useShallow((state) => ({
      contextMenu: state.contextMenu,
      setContextMenu: state.setContextMenu,
      zoom: state.zoom,
      pan: state.pan,
    })),
  )
  const ref = React.useRef<HTMLDivElement>(null)
  usePreventScroll({ enabled: state.contextMenu !== null })
  useOutsideClick({ action: () => state.setContextMenu(null), providedRef: ref })
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
  const state = useAppStore((state) => ({
    contextMenu: state.contextMenu,
    setContextMenu: state.setContextMenu,
    removeConnection: state.removeConnection,
    deleteItem: state.deleteItem,
  }))
  if (state.contextMenu === null) return null
  const close = () => state.setContextMenu(null)
  switch (state.contextMenu.elementType) {
    case 'connections': {
      return (
        <item
          className={styles.item}
          onClick={() => {
            state.removeConnection(state.contextMenu?.id ?? '')
            close()
          }}
        >
          <p>Delete</p>
          <TrashIcon />
        </item>
      )
    }
    case 'item': {
      return (
        <item
          className={styles.item}
          onClick={() => {
            state.deleteItem(state.contextMenu?.id ?? '')
            close()
          }}
        >
          <p>Delete</p>
          <TrashIcon />
        </item>
      )
    }
  }
}
