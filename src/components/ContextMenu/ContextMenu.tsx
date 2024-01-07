import type { FC } from 'react'
import React from 'react'
import styles from './ContextMenu.module.scss'
import { useAppStore } from '@/state/state'
import { useOutsideClick } from '@/utils/useOutsideClick'
import { BsTrash3 as TrashIcon } from 'react-icons/bs'

export const ContextMenu: FC = () => {
  const state = useAppStore((state) => ({
    contextMenu: state.contextMenu,
    setContextMenu: state.setContextMenu,
    zoom: state.zoom,
    pan: state.pan,
  }))
  const ref = React.useRef<HTMLDivElement>(null)
  useOutsideClick({ action: () => state.setContextMenu(null), providedRef: ref })
  if (!state.contextMenu) return null
  return (
    <container
      ref={ref}
      className={styles.container}
      style={{
        left: state.contextMenu.position.x,
        top: state.contextMenu.position.y,
        transform: `scale(${1 / state.zoom})`,
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
  }))
  if (state.contextMenu === null) return null
  const close = () => state.setContextMenu(null)
  switch (state.contextMenu.elementType) {
    case 'connections': {
      return (
        <>
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
        </>
      )
    }
  }
}
