import React from 'react'
import { LuRefreshCcw } from 'react-icons/lu'

import { useConvertSketchToImage } from '@/fal/workflows/convert-sketch-to-painting'
import { createMockPrompt } from '@/mock/mock-items'
import { useStore } from '@/state/gen-state'

import style from './RandomizePromptButton.module.scss'

export const RandomizePromptButton: React.FC<{
  windowId: string
  textRef: React.MutableRefObject<string>
}> = ({ windowId, textRef }) => {
  const state = useStore([`editItemContent`, `editItem`])
  const generateImage = useConvertSketchToImage()
  return (
    <button
      className={style.wrapper}
      title="Randomize prompt"
      onClick={async () => {
        const prompt = createMockPrompt()
        textRef.current = prompt
        state.editItem(windowId, {
          title: prompt,
        })
        state.editItemContent(windowId, {
          prompt,
        })
        await generateImage({
          generatedFromItemId: windowId,
        })
      }}
    >
      <LuRefreshCcw className={style.icon} />
    </button>
  )
}
