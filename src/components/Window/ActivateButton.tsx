import React from 'react'
import { IoRadioButtonOff, IoRadioButtonOn } from 'react-icons/io5'

import { useStore } from '@/state/gen-state'
import type { ItemWithSpecificBody } from '@/state/items'
import { joinClasses } from '@/utils/joinClasses'

import style from './ActivateButton.module.scss'

export const ActivateButton: React.FC<{
  item: ItemWithSpecificBody<`generated`>
}> = ({ item }) => {
  const state = useStore([`toggleItemActive`])
  return (
    <button
      className={joinClasses(
        style.wrapper,
        item.body.activatedAt && style.isActive,
      )}
      onClick={() => state.toggleItemActive(item.id)}
    >
      <p>{item.body.activatedAt ? `Activated` : `Activate`}</p>
      {item.body.activatedAt ? <IoRadioButtonOn /> : <IoRadioButtonOff />}
    </button>
  )
}
