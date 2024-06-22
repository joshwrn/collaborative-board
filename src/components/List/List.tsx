'use client'
import type { FC } from 'react'
import React from 'react'

import { ItemComponent } from '../Item/Item'
import styles from './List.module.scss'
import { useAppStore } from '@/state/gen-state'
import { TfiWrite } from 'react-icons/tfi'
import { useShallow } from 'zustand/react/shallow'
import { createMockItem } from '@/mock/mock-items'
import { useStore } from '@/state-signia/store'

export const ListInternal: FC = () => {
  // const state = useAppStore(
  //   useShallow((state) => ({
  //     items: state.items,
  //     setItems: state.setItems,
  //     windows: state.windows,
  //   })),
  // )
  const state = useStore()
  return (
    <wrapper className={styles.wrapper}>
      <header className={styles.header}>
        <button
          onClick={() => {
            // state.items.setItems((items) => [...items, ...createMockItem(1)])
          }}
        >
          <TfiWrite />
        </button>
      </header>
      <container className={styles.listContainer}>
        {state.items.items.map((item) => (
          <ItemComponent
            key={item.id}
            item={item}
            isOpen={state.windows.open.some((window) => window.id === item.id)}
          />
        ))}
      </container>
    </wrapper>
  )
}

export const List = React.memo(ListInternal)
