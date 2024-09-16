import React from 'react'
import { LuRefreshCcw } from 'react-icons/lu'

import { createMockPrompt } from '@/mock/mock-items'
import { useZ } from '@/state/gen-state'

import style from './RandomizePromptButton.module.scss'

export const RandomizePromptButton: React.FC<{
  windowId: string
  textRef: React.MutableRefObject<string>
}> = ({ windowId, textRef }) => {
  const state = useZ([`editItemContent`, `editItem`, `fetchRealtimeImage`])
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
        await state.fetchRealtimeImage(windowId)
      }}
    >
      <LuRefreshCcw className={style.icon} />
    </button>
  )
}
