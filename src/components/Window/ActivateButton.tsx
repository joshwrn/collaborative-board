import React from 'react'
import { IoRadioButtonOff, IoRadioButtonOn } from 'react-icons/io5'

import { useZ } from '@/state/gen-state'
import { findItem, type ItemWithSpecificBody } from '@/state/items'
import { joinClasses } from '@/utils/joinClasses'

import style from './ActivateButton.module.scss'

export const ActivateButton: React.FC<{
  itemId: string
}> = ({ itemId }) => {
  const state = useZ(
    [`toggleItemActive`, `fetchRealtimeImage`, `findParentItem`],
    (state) => ({
      item: findItem(state.items, itemId) as ItemWithSpecificBody<`generated`>,
    }),
  )
  return (
    <button
      className={joinClasses(
        style.wrapper,
        state.item.body.activatedAt && style.isActive,
      )}
      onClick={async () => {
        state.toggleItemActive(state.item.id)
        const parent = state.findParentItem(state.item.id)
        await state.fetchRealtimeImage(parent.id)
      }}
    >
      <p>{state.item.body.activatedAt ? `Activated` : `Activate`}</p>
      {state.item.body.activatedAt ? <IoRadioButtonOn /> : <IoRadioButtonOff />}
    </button>
  )
}
