'use client'
import type { FC } from 'react'
import React from 'react'
import { IoClose } from 'react-icons/io5'

import { useStore } from '@/state/gen-state'

import { ItemComponent } from '../Item/Item'
import styles from './List.module.scss'

const ListInternal: FC = () => {
  const state = useStore([`items`, `setState`, `windows`, `generatingCanvas`])

  return (
    <wrapper className={styles.wrapper}>
      <header className={styles.header}>
        <button
          className={styles.close}
          onClick={() => {
            state.setState((draft) => {
              draft.showItemList = false
            })
          }}
        >
          <IoClose />
        </button>
      </header>
      <container className={styles.listContainer}>
        {state.items.map((item) => (
          <ItemComponent
            key={item.id}
            item={item}
            isGeneratingCanvas={
              !!state.generatingCanvas.find(
                (canvas) => canvas.newItemId === item.id,
              )
            }
            isOpen={state.windows.some((window) => window.id === item.id)}
          />
        ))}
      </container>
    </wrapper>
  )
}

export const List = React.memo(ListInternal)
