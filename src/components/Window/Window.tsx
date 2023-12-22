'use client'
import type { FC } from 'react'
import React from 'react'

import { useDragControls, motion } from 'framer-motion'
import styles from './Window.module.scss'

export const Window: FC = () => {
  const dragControls = useDragControls()

  function startDrag(e: React.PointerEvent<HTMLSpanElement>) {
    dragControls.start(e)
  }

  const scale = 1
  const width = 700
  const height = 500

  return (
    <motion.div
      className={styles.wrapper}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
      drag
      dragElastic={0}
      dragMomentum={false}
      dragListener={false}
      dragControls={dragControls}
    >
      <nav className={styles.topBar} onPointerDown={startDrag}>
        <button className={styles.close} />
        <button className={styles.full} />
      </nav>
      <header className={styles.titleBar}>
        <h3>Bill Gates</h3>
        <p>bill.gates@microsoft.com</p>
      </header>
    </motion.div>
  )
}
