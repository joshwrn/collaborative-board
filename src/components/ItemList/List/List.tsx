'use client'
import { AnimatePresence, motion } from 'framer-motion'
import type { FC } from 'react'
import React from 'react'
import { IoClose } from 'react-icons/io5'

import { useStore } from '@/state/gen-state'

import { ItemComponent } from '../Item/Item'
import styles from './List.module.scss'

const List_Internal: FC = () => {
  const state = useStore([`items`, `setState`, `windows`])

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0, x: -200 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -200 }}
      transition={{
        type: `spring`,
        stiffness: 500,
        damping: 50,
      }}
    >
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
      <div className={styles.listContainer}>
        {state.items.map((item) => (
          <ItemComponent
            key={item.id}
            item={item}
            isOpen={state.windows.some((window) => window.id === item.id)}
          />
        ))}
      </div>
    </motion.div>
  )
}

const List = React.memo(List_Internal)

export const ListGuard = () => {
  const state = useStore([`showItemList`])
  return <AnimatePresence>{state.showItemList && <List />}</AnimatePresence>
}
