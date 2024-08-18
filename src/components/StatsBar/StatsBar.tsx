import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { RiRefreshLine } from 'react-icons/ri'
import { TbAppWindow as WindowIcon } from 'react-icons/tb'

import { useStore } from '@/state/gen-state'

import style from './StatsBar.module.scss'

const StatsBar_Internal: React.FC = () => {
  const state = useStore([`windows`, `generatingCanvas`])
  return (
    <div className={style.wrapper}>
      <motion.div className={style.stat}>
        <WindowIcon size={18} stroke={`var(--white-65)`} />
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={`${state.windows.length - state.generatingCanvas.length}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            transition={{
              type: `spring`,
              duration: 0.5,
            }}
          >
            {state.windows.length - state.generatingCanvas.length}
          </motion.p>
        </AnimatePresence>
      </motion.div>
      <motion.div className={style.stat}>
        <RiRefreshLine size={17} fill={`var(--white-65)`} />
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            layout
            key={`${state.generatingCanvas.length}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            transition={{
              type: `spring`,
              duration: 0.5,
            }}
          >
            {state.generatingCanvas.length ?? 0}
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export const StatsBar = React.memo(StatsBar_Internal)
