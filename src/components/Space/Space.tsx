import type { FC } from 'react'
import React from 'react'

import * as x from '@stylexjs/stylex'

const styles = x.create({
  wrapper: {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    flexShrink: 1,
    backgroundColor: '#1B1B1B',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
})

export const Space: FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return <wrapper {...x.props(styles.wrapper)}>{children}</wrapper>
}
