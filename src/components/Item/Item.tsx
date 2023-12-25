'use client'
import type { FC } from 'react'
import React from 'react'

import styles from './Item.module.scss'
import { Email } from '@/state/emails'
import { useAppStore } from '@/state/state'

export const Item: FC<{ email: Email }> = ({ email }) => {
  const toggleEmailOpen = useAppStore((state) => state.toggleOpenEmail)
  return (
    <wrapper
      className={styles.wrapper}
      onClick={() => toggleEmailOpen(email.id)}
    >
      <h3>{email.from}</h3>
      <h1>{email.subject}</h1>
      <p>
        {email.body.substring(0, 90)}
        {email.body.length > 90 && '...'}
      </p>
    </wrapper>
  )
}
