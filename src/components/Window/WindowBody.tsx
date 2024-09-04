import React from 'react'
import { match } from 'ts-pattern'

import { useStore } from '@/state/gen-state'
import type { Item, ItemWithSpecificBody } from '@/state/items'
import type { WindowType } from '@/state/windows'

import { Canvas } from '../Canvas/Canvas'
import { RandomizePromptButton } from './RandomizePromptButton'
import styles from './WindowBody.module.scss'

const Text = ({
  textRef,
  windowId,
}: {
  textRef: React.MutableRefObject<string>
  windowId: string
}) => {
  const ref = React.useRef<HTMLParagraphElement>(null)
  const state = useStore([`editItemContent`, `editItem`])

  return (
    <p
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onInput={() => {
        if (!ref.current) return
        state.editItem(windowId, {
          subject: ref.current.innerText,
        })
        state.editItemContent(windowId, {
          prompt: ref.current.innerText,
        })
      }}
    >
      {textRef.current}
    </p>
  )
}

const Prompt: React.FC<{ value: string; windowId: string }> = ({
  value,
  windowId,
}) => {
  const textRef = React.useRef(value)
  return (
    <div className={styles.textContainer}>
      <header>
        <h1>Prompt</h1>
        <RandomizePromptButton windowId={windowId} textRef={textRef} />
      </header>
      <Text textRef={textRef} windowId={windowId} />
    </div>
  )
}

const GeneratorBody: React.FC<{
  item: ItemWithSpecificBody<`generator`>
  window: WindowType
  isPinned: boolean
}> = ({ item, window, isPinned }) => {
  return (
    <>
      <Prompt value={item.body.prompt} windowId={window.id} />
      <Canvas isPinned={isPinned} window={window} content={item.body.base64} />
    </>
  )
}

export const WindowBody: React.FC<{
  item: Item
  window: WindowType
  isPinned: boolean
}> = ({ item, window, isPinned }) => {
  return (
    <>
      {match(item)
        .with({ body: { type: `generator` } }, (body) => (
          <GeneratorBody item={body} window={window} isPinned={isPinned} />
        ))
        .otherwise(() => null)}
    </>
  )
}
