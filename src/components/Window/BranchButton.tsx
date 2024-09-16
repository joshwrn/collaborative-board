import React from 'react'
import { IoGitBranchOutline } from 'react-icons/io5'

import { useZ } from '@/state/gen-state'

import style from './BranchButton.module.scss'

export const BranchButton_Internal: React.FC<{
  itemId: string
}> = ({ itemId }) => {
  const state = useZ([`generateInitialWindow`])
  return (
    <section className={style.wrapper}>
      <button
        onClick={async () => {
          await state.generateInitialWindow(itemId)
        }}
      >
        <p>Branch</p>
        <IoGitBranchOutline />
      </button>
    </section>
  )
}

export const BranchButton = React.memo(BranchButton_Internal)
