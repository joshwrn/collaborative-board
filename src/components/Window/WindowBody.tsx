import Image from 'next/image'
import React from 'react'
import { match } from 'ts-pattern'

import { useStore } from '@/state/gen-state'
import type { Item, ItemWithSpecificBody } from '@/state/items'
import type { WindowType } from '@/state/windows'

import { Canvas, returnCanvasAttributes } from './Canvas/Canvas'
import { RandomizePromptButton } from './RandomizePromptButton'
import styles from './WindowBody.module.scss'

const Text = ({
  textRef,
  onInput,
  onBlur,
}: {
  textRef: React.MutableRefObject<string>
  onInput: (e: React.FormEvent<HTMLParagraphElement>, p: string) => void
  onBlur: (p: string) => void
}) => {
  const ref = React.useRef<HTMLParagraphElement>(null)
  return (
    <p
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => {
        if (!ref.current) return
        onInput(e, ref.current.innerText)
      }}
      onBlur={() => {
        if (!ref.current) return
        onBlur(ref.current.innerText)
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
  const state = useStore([`editItemContent`, `editItem`, `fetchRealtimeImage`])
  return (
    <div className={styles.textContainer}>
      <header>
        <h1>Subject</h1>
        <RandomizePromptButton windowId={windowId} textRef={textRef} />
      </header>
      <Text
        onBlur={async (p) => {
          await state.fetchRealtimeImage(windowId)
        }}
        textRef={textRef}
        onInput={(e, p) => {
          state.editItem(windowId, {
            title: p,
          })
          state.editItemContent(windowId, {
            prompt: p,
          })
        }}
      />
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

const Modifier: React.FC<{
  value: string
  windowId: string
}> = ({ value, windowId }) => {
  const textRef = React.useRef(value)
  const state = useStore([
    `editItemContent`,
    `editItem`,
    `findParentItem`,
    `fetchRealtimeImage`,
  ])
  return (
    <div className={styles.textContainer}>
      <header>
        <h1>Modifier</h1>
      </header>
      <Text
        onBlur={async () => {
          const parent = state.findParentItem(windowId)
          await state.fetchRealtimeImage(parent.id)
        }}
        textRef={textRef}
        onInput={(e, p) => {
          state.editItem(windowId, {
            title: p,
          })
          state.editItemContent(windowId, {
            modifier: p,
          })
        }}
      />
    </div>
  )
}

const GeneratedBody: React.FC<{
  item: ItemWithSpecificBody<`generated`>
  window: WindowType
  isPinned: boolean
}> = ({ item, window, isPinned }) => {
  const state = useStore([`zoom`, `fullScreenWindow`])
  const attributes = returnCanvasAttributes(
    window,
    state.zoom,
    state.fullScreenWindow === window.id,
    isPinned,
  )
  return (
    <>
      <Modifier value={item.body.modifier} windowId={window.id} />
      <div
        className={styles.imageContainer}
        style={{
          width: attributes.width,
          height: attributes.height,
        }}
      >
        {item.body.base64 !== `` && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.image}
              src={item.body.base64}
              alt="generated image"
              width={attributes.width}
              height={attributes.height}
            />
          </>
        )}
      </div>
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
        .with({ body: { type: `generated` } }, (body) => (
          <GeneratedBody item={body} window={window} isPinned={isPinned} />
        ))
        .otherwise(() => null)}
    </>
  )
}
