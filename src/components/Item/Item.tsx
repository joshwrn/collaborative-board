'use client'
import type { FC } from 'react'
import React from 'react'

import styles from './Item.module.scss'
import { useAppStore } from '@/state/state'
import { joinClasses } from '@/utils/joinClasses'
import { useShallow } from 'zustand/react/shallow'
import animations from '@/style/spinningBackground.module.scss'
import type { Item } from '@/state/items'

const ItemInternal: FC<{ item: Item; isOpen: boolean }> = ({ item, isOpen }) => {
  const state = useAppStore(
    useShallow((state) => ({
      toggleOpen: state.toggleOpenWindow,
      openContextMenu: state.openContextMenu,
      setHoveredItem: state.setHoveredItem,
    })),
  )
  return (
    <outer
      className={joinClasses(
        animations.spinningBg,
        styles.outer,
        isOpen && styles.isOpenOuter,
      )}
    >
      <wrapper
        className={joinClasses(styles.wrapper, isOpen && styles.isOpenWrapper)}
        onClick={() => state.toggleOpen(item.id)}
        onMouseEnter={() => state.setHoveredItem(item.id)}
        onMouseLeave={() => state.setHoveredItem(null)}
        onContextMenu={(e) => {
          e.preventDefault()
          state.openContextMenu({ elementType: 'item', id: item.id })
        }}
      >
        <h3>{item.from}</h3>
        <h1>{item.subject}</h1>
        <p>
          {item.body.substring(0, 90)}
          {item.body.length > 90 && '...'}
        </p>
      </wrapper>
    </outer>
  )
}

export const ItemComponent = React.memo(ItemInternal)
