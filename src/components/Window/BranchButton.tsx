import { motion } from 'framer-motion'
import React from 'react'
import { IoGitBranchOutline } from 'react-icons/io5'

import { useStore } from '@/state/gen-state'
import type { Item } from '@/state/items'

import style from './BranchButton.module.scss'

export const BranchButton_Internal: React.FC<{
  item: Item
}> = ({ item }) => {
  const state = useStore([`generateInitialWindow`])
  return (
    <section className={style.wrapper}>
      <button
        onClick={async () => {
          await state.generateInitialWindow(item.id)
        }}
      >
        <p>Branch</p>
        <IoGitBranchOutline />
      </button>
    </section>
  )
}

export const BranchButton = React.memo(BranchButton_Internal)
