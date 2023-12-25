'use client'
import type { FC } from 'react'
import React from 'react'

import { Item } from '../Item/Item'
import styles from './List.module.scss'
import { useAppStore } from '@/state/state'
import { TfiWrite } from 'react-icons/tfi'

export const List: FC = () => {
  const s = useAppStore((state) => ({
    emails: state.emails,
    setEmails: state.setEmails,
  }))
  return (
    <wrapper className={styles.wrapper}>
      <header className={styles.header}>
        <button
          onClick={() => {
            s.setEmails((emails) => [
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
        {s.emails.map((email) => (
          <Item key={email.id} email={email} />
        ))}
      </container>
    </wrapper>
  )
}
