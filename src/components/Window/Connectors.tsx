import type { FC } from 'react'
import React from 'react'

import styles from './Connectors.module.scss'
import { joinClasses } from '@/utils/joinClasses'
import { SIDES } from '@/state/windows'
import { FaArrowRightLong } from 'react-icons/fa6'

export const Connectors: FC = () => {
  return (
    <container className={styles.container} data-role="connectors">
      {SIDES.map((side) => (
        <div key={side} className={joinClasses(styles[side], styles.connector)}>
          <FaArrowRightLong />
        </div>
      ))}
    </container>
  )
}
