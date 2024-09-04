import { motion } from 'framer-motion'
import React from 'react'
import { IoSparklesSharp } from 'react-icons/io5'

import { useStore } from '@/state/gen-state'
import type { Item } from '@/state/items'

import style from './GenerateButton.module.scss'

export const GenerateButton_Internal: React.FC<{
  item: Item
}> = ({ item }) => {
  const state = useStore([`generateInitialWindow`])
  return (
    <section className={style.wrapper}>
      <motion.button
        onClick={async () => {
          await state.generateInitialWindow(item.id)
        }}
        // className={joinClasses(
        //   generateImage.isPending && style.isPending,
        //   disabled && style.isDisabled,
        // )}
      >
        <p>Generate</p>
        <IoSparklesSharp />
      </motion.button>
    </section>
  )
}

export const GenerateButton = React.memo(GenerateButton_Internal)
