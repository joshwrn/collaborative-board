import React from 'react'
import { LuRefreshCcw } from 'react-icons/lu'

import { createMockPrompt } from '@/mock/mock-items'
import { useStore } from '@/state/gen-state'

import style from './RandomizePromptButton.module.scss'

export const RandomizePromptButton: React.FC<{
  windowId: string
  contentId: string
  textRef: React.MutableRefObject<string>
}> = ({ windowId, contentId, textRef }) => {
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
          type: `text`,
          content: prompt,
          id: contentId,
        })
      }}
    >
      <LuRefreshCcw className={style.icon} />
    </button>
  )
}
