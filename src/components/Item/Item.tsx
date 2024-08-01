'use client'
import type { FC } from 'react'
import React from 'react'

import styles from './Item.module.scss'
import { useStore } from '@/state/gen-state'
import { joinClasses } from '@/utils/joinClasses'
import type { Item, ItemBody } from '@/state/items'
import { match, P } from 'ts-pattern'

const matchBody = (body?: ItemBody): JSX.Element | JSX.Element[] | null => {
  return match(body?.content)
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
  const state = useStore([
    'toggleOpenWindow',
    'openContextMenu',
    'setHoveredItem',
  ])
  return (
    <wrapper
      className={joinClasses(styles.wrapper, isOpen && styles.isOpenWrapper)}
      onClick={() => state.toggleOpenWindow(item.id)}
      onMouseEnter={() => state.setHoveredItem(item.id)}
      onMouseLeave={() => state.setHoveredItem(null)}
      onContextMenu={(e) => {
        e.preventDefault()
        state.openContextMenu({ elementType: 'item', id: item.id })
      }}
    >
      <h1>{item.subject}</h1>
      {matchBody(item.body[0])}
    </wrapper>
  )
}

export const ItemComponent = React.memo(ItemInternal)
