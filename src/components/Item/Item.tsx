'use client'
import type { FC } from 'react'
import React from 'react'

import styles from './Item.module.scss'
import { useAppStore } from '@/state/gen-state'
import { joinClasses } from '@/utils/joinClasses'
import { useShallow } from 'zustand/react/shallow'
import animations from '@/style/spinningBackground.module.scss'
import type { Iframe, Item } from '@/state/items'
import { match, P } from 'ts-pattern'

const matchBody = (
  body: string | Iframe,
): JSX.Element | JSX.Element[] | null => {
  return match(body)
    .with(P.string, (value) => (
      <p>
        {value.substring(0, 90)}
        {value.length > 90 && '...'}
      </p>
    ))
    .with(
      {
        src: P.string,
      },
      (value) => <p>One Attachment</p>,
    )
    .otherwise(() => null)
}

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
        <h3></h3>
        <h1>{item.subject}</h1>
        {matchBody(item.body[0])}
      </wrapper>
    </outer>
  )
}

export const ItemComponent = React.memo(ItemInternal)
