import React from 'react'
import style from './Autosave.module.scss'
import { useAutoSave } from '@/utils/useAutoSave'
import { joinClasses } from '@/utils/joinClasses'
import { IoCheckmarkSharp as CheckIcon } from 'react-icons/io5'
import { RiRefreshLine } from 'react-icons/ri'
import { AnimatePresence, motion } from 'framer-motion'

const variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: 10,
  },
}

export const Autosave: React.FC = () => {
  const saveState = useAutoSave()
  return (
    <div
      className={joinClasses(style.wrapper, saveState.isDirty && style.dirty)}
    >
      <AnimatePresence mode="wait">
        {saveState.isDirty ? (
          <motion.div
            key="dirty"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <RiRefreshLine
              size={20}
              style={{
                fill: 'var(--white-65)',
              }}
            />
            <p>Unsaved</p>
          </motion.div>
        ) : (
          <motion.div
            key="clean"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <CheckIcon
              size={20}
              style={{
                stroke: '#32ff73db',
              }}
            />
            <p>Saved</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
