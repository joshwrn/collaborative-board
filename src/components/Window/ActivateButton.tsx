import React from 'react'
import { IoRadioButtonOff, IoRadioButtonOn } from 'react-icons/io5'

import { useZ } from '@/state/gen-state'
import type { ItemWithSpecificBody } from '@/state/items'
import { joinClasses } from '@/utils/joinClasses'

import style from './ActivateButton.module.scss'

export const ActivateButton: React.FC<{
  item: ItemWithSpecificBody<`generated`>
}> = ({ item }) => {
  const state = useZ([
    `toggleItemActive`,
    `fetchRealtimeImage`,
    `findParentItem`,
  ])
  return (
    <button
      className={joinClasses(
        style.wrapper,
        item.body.activatedAt && style.isActive,
      )}
      onClick={async () => {
        state.toggleItemActive(item.id)
        const parent = state.findParentItem(item.id)
        await state.fetchRealtimeImage(parent.id)
      }}
    >
      <p>{item.body.activatedAt ? `Activated` : `Activate`}</p>
      {item.body.activatedAt ? <IoRadioButtonOn /> : <IoRadioButtonOff />}
    </button>
  )
}
