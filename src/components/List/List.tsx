import type { FC } from 'react'
import React from 'react'

import * as x from '@stylexjs/stylex'
import { Item } from '../Item/Item'

const styles = x.create({
  wrapper: {
    width: '350px',
    height: '100%',
    backgroundColor: '#1B1B1B',
    display: 'flex',
    flexDirection: 'column',
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: '#3B3B3B',
    padding: '15px',
    opacity: 0.5,
  },
})

export const List: FC = () => {
  return (
    <wrapper {...x.props(styles.wrapper)}>
      <Item />
    </wrapper>
  )
}
