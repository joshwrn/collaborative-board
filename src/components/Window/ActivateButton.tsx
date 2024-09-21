import React from 'react'
import { IoRadioButtonOff, IoRadioButtonOn } from 'react-icons/io5'

import { useConvertSketchToImage } from '@/fal/workflows/convert-sketch-to-painting'
import { useStore } from '@/state/gen-state'
import { joinClasses } from '@/utils/joinClasses'

import style from './ActivateButton.module.scss'

const ActivateButton_Internal: React.FC<{
  id: string
  isActive: boolean
}> = ({ id, isActive }) => {
  const state = useStore([`toggleItemActive`, `findParentItem`])
  const generateImage = useConvertSketchToImage()
  return (
    <button
      className={joinClasses(style.wrapper, isActive && style.isActive)}
      onClick={async () => {
        state.toggleItemActive(id)
        const generatedFromItem = state.findParentItem(id)
        await generateImage({
          generatedFromItemId: generatedFromItem.id,
        })
      }}
    >
      <p>{isActive ? `Activated` : `Activate`}</p>
      {isActive ? <IoRadioButtonOn /> : <IoRadioButtonOff />}
    </button>
  )
}
export const ActivateButton = React.memo(ActivateButton_Internal)
