import React from 'react'
import { LuRefreshCcw } from 'react-icons/lu'

import { createMockPrompt } from '@/mock/mock-items'
import { useStore } from '@/state/gen-state'

import style from './RandomizePromptButton.module.scss'

export const RandomizePromptButton: React.FC<{
  windowId: string
  textRef: React.MutableRefObject<string>
}> = ({ windowId, textRef }) => {
  const state = useStore([`editItemContent`, `editItem`])
  return (
    <button
      className={style.wrapper}
      title="Randomize prompt"
      onClick={() => {
        const prompt = createMockPrompt()
        textRef.current = prompt
        state.editItem(windowId, {
          subject: prompt,
        })
        state.editItemContent(windowId, {
          prompt,
        })
      }}
    >
      <LuRefreshCcw className={style.icon} />
    </button>
  )
}
