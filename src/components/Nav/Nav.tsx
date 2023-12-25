import type { FC } from 'react'
import React from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { LuSend } from 'react-icons/lu'

import { IoTrashOutline } from 'react-icons/io5'
import { CiSettings } from 'react-icons/ci'
import { GoInbox } from 'react-icons/go'

import styles from './Nav.module.scss'

export const Nav: FC = () => {
  return (
    <nav className={styles.nav}>
      <FaUserCircle className={styles.icon} />
      <section>
        <GoInbox className={styles.icon} />
        <LuSend className={styles.icon} />
        <IoTrashOutline className={styles.icon} />
      </section>
      <CiSettings className={styles.icon} />
    </nav>
  )
}
