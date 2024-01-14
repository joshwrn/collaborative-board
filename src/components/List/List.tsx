'use client'
import type { FC } from 'react'
import React from 'react'

import { Item } from '../Item/Item'
import styles from './List.module.scss'
import { useAppStore } from '@/state/state'
import { TfiWrite } from 'react-icons/tfi'
import { useShallow } from 'zustand/react/shallow'

export const List: FC = () => {
  const state = useAppStore(
    useShallow((state) => ({
      emails: state.emails,
      setEmails: state.setEmails,
      windows: state.windows,
    })),
  )
  return (
    <wrapper className={styles.wrapper}>
      <header className={styles.header}>
        <button
          onClick={() => {
            state.setEmails((emails) => [
              ...emails,
              {
                id: Math.random().toString(),
                from: 'me',
                to: 'you',
                address: 'idk',
                subject: 'hello',
                body: 'world',
              },
            ])
          }}
        >
          <TfiWrite />
        </button>
      </header>
      <container className={styles.listContainer}>
        {state.emails.map((email) => (
          <Item
            key={email.id}
            email={email}
            isOpen={state.windows.some((window) => window.id === email.id)}
          />
        ))}
      </container>
    </wrapper>
  )
}
