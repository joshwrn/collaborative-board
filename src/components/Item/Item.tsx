'use client'
import type { FC } from 'react'
import React from 'react'

import styles from './Item.module.scss'
import { Email } from '@/state/emails'
import { useAppStore } from '@/state/state'
import { joinClasses } from '@/utils/joinClasses'
import { useShallow } from 'zustand/react/shallow'
import animations from '@/style/spinningBackground.module.scss'

const ItemInternal: FC<{ email: Email; isOpen: boolean }> = ({
  email,
  isOpen,
}) => {
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
        onClick={() => state.toggleOpen(email.id)}
        onMouseEnter={() => state.setHoveredItem(email.id)}
        onMouseLeave={() => state.setHoveredItem(null)}
        onContextMenu={(e) => {
          e.preventDefault()
          state.openContextMenu({ elementType: 'item', id: email.id })
        }}
      >
        <h3>{email.from}</h3>
        <h1>{email.subject}</h1>
        <p>
          {email.body.substring(0, 90)}
          {email.body.length > 90 && '...'}
        </p>
      </wrapper>
    </outer>
  )
}

export const Item = React.memo(ItemInternal)
