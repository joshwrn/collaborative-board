import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

import { joinClasses } from '@/utils/joinClasses'

import style from './LoadingOverlay.module.scss'

export const LoadingOverlay: React.FC<{
  isLoading: boolean
}> = ({ isLoading }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={joinClasses(`loadingShimmer`, style.loadingShimmer)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.75 } }}
        >
          <div className={style.blocker}></div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
