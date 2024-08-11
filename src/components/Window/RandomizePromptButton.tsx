import React from 'react'
import style from './RandomizePromptButton.module.scss'
import { LuRefreshCcw } from 'react-icons/lu'
import { useStore } from '@/state/gen-state'
import { createMockPrompt } from '@/mock/mock-items'

export const RandomizePromptButton: React.FC<{
  windowId: string
  contentId: string
  textRef: React.MutableRefObject<string>
}> = ({ windowId, contentId, textRef }) => {
  const state = useStore(['editItemContent', 'editItem'])
  return (
    <button
      className={style.wrapper}
      title="Randomize prompt"
      onClick={() => {
        const prompt = createMockPrompt()
        console.log('randomizing prompt', prompt)
        textRef.current = prompt
        state.editItem(windowId, {
          subject: prompt,
        })
        state.editItemContent(windowId, {
          type: 'text',
          content: prompt,
          id: contentId,
        })
      }}
    >
      <LuRefreshCcw className={style.icon} />
    </button>
  )
}
