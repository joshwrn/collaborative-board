import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

import style from './TopBarModal.module.scss'
import { joinClasses } from '@/utils/joinClasses'

export const TopBarModal: React.FC<{
  onClose: () => void
  children: React.ReactNode
  modalClassName?: string
}> = ({ children, onClose, modalClassName }) => {
  return (
    <motion.div className={`modalContainer`}>
      <div
        className={`modalBackdrop`}
        style={{
          opacity: 0,
        }}
        onClick={() => onClose()}
      />
      <motion.div
        className={joinClasses(style.modal, modalClassName)}
        initial={{ opacity: 0, y: `-50%` }}
        animate={{
          opacity: 1,
          y: `0%`,
          transition: {
            type: `spring`,
            stiffness: 500,
            damping: 25,
          },
        }}
        exit={{ opacity: 1, y: `calc(-100% - 45px)` }}
        transition={{
          type: `spring`,
          stiffness: 500,
          damping: 50,
        }}
      >
        {children}
      </motion.div>
      <div className={style.blocker} />
    </motion.div>
  )
}
