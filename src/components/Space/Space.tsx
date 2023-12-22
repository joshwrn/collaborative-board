import type { FC } from 'react'
import React from 'react'

import styles from './Space.module.scss'

export const Space: FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return <wrapper className={styles.wrapper}>{children}</wrapper>
}
