import type { FC } from 'react'
import React from 'react'

import { Item } from '../Item/Item'
import styles from './List.module.scss'

export const List: FC = () => {
  return (
    <wrapper className={styles.wrapper}>
      <Item />
    </wrapper>
  )
}
