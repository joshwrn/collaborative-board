import type { FC } from 'react'
import React from 'react'

import * as x from '@stylexjs/stylex'

const styles = x.create({
  wrapper: {
    height: '125px',
    width: '100%',
    backgroundColor: '#2B2B2B',
    borderRadius: '10px',
  },
})

export const Item: FC = () => {
  return <wrapper {...x.props(styles.wrapper)}></wrapper>
}
