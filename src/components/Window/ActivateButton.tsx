import React from 'react'
import { IoRadioButtonOff, IoRadioButtonOn } from 'react-icons/io5'

import { useStore } from '@/state/gen-state'
import type { ItemWithSpecificBody } from '@/state/items'
import { joinClasses } from '@/utils/joinClasses'

import style from './ActivateButton.module.scss'

const ActivateButton_Internal: React.FC<{
  id: string
  isActive: boolean
}> = ({ id, isActive }) => {
  const state = useStore([
    `toggleItemActive`,
    `fetchRealtimeImage`,
    `findParentItem`,
  ])
  return (
    <button
      className={joinClasses(style.wrapper, isActive && style.isActive)}
      onClick={async () => {
        state.toggleItemActive(id)
        const parent = state.findParentItem(id)
        await state.fetchRealtimeImage(parent.id)
      }}
    >
      <p>{isActive ? `Activated` : `Activate`}</p>
      {isActive ? <IoRadioButtonOn /> : <IoRadioButtonOff />}
    </button>
  )
}
export const ActivateButton = React.memo(ActivateButton_Internal)
