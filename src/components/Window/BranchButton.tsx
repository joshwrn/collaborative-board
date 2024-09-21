import React from 'react'
import { IoGitBranchOutline } from 'react-icons/io5'

import { useConvertSketchToImage } from '@/fal/workflows/convert-sketch-to-painting'
import { useStore } from '@/state/gen-state'

import style from './BranchButton.module.scss'

export const BranchButton_Internal: React.FC<{
  id: string
}> = ({ id }) => {
  const state = useStore([`generateInitialWindow`])
  const generateImage = useConvertSketchToImage()
  return (
    <section className={style.wrapper}>
      <button
        onClick={async () => {
          state.generateInitialWindow(id)
          await generateImage({
            generatedFromItemId: id,
          })
        }}
      >
        <p>Branch</p>
        <IoGitBranchOutline />
      </button>
    </section>
  )
}

export const BranchButton = React.memo(BranchButton_Internal)
