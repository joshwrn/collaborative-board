'use client'
import type { FC } from 'react'
import React from 'react'

import * as x from '@stylexjs/stylex'
import { useDragControls, motion } from 'framer-motion'

const styles = x.create({
  wrapper: {
    backgroundColor: '#444444',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#6B6B6B',
    color: '#ECECEC',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'absolute',
  },
  topBar: {
    backgroundColor: '#2B2B2B',
    height: '40px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: '#6B6B6B',
    width: '100%',
    padding: '0 15px',
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
  },
  windowButton: {
    borderRadius: '50%',
    width: '10px',
    height: '10px',
  },
  close: {
    backgroundColor: '#F14971',
  },
  full: {
    backgroundColor: '#3FCD6F',
  },
  titleBar: {
    backgroundColor: '#2B2B2B',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: '#6B6B6B',
    width: '100%',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    userSelect: 'none',
  },
})

export const Window: FC = () => {
  const dragControls = useDragControls()

  function startDrag(e: React.PointerEvent<HTMLSpanElement>) {
    dragControls.start(e)
  }

  const scale = 0.5
  const width = 700
  const height = 500

  return (
    <motion.div
      {...x.props(styles.wrapper)}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        scale,
      }}
      key={scale}
      drag
      dragElastic={0}
      dragMomentum={false}
      dragListener={false}
      dragControls={dragControls}
    >
      <nav {...x.props(styles.topBar)} onPointerDown={startDrag}>
        <button {...x.props(styles.close, styles.windowButton)} />
        <button {...x.props(styles.full, styles.windowButton)} />
      </nav>
      <header {...x.props(styles.titleBar)}>
        <h3>Bill Gates</h3>
        <p>bill.gates@microsoft.com</p>
      </header>
    </motion.div>
  )
}
