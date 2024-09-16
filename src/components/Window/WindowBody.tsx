import React from 'react'
import { match } from 'ts-pattern'

import { useZ } from '@/state/gen-state'
import { findItem, type ItemWithSpecificBody } from '@/state/items'
import { findWindow } from '@/state/windows'

import { Canvas, returnCanvasAttributes } from './Canvas/Canvas'
import { RandomizePromptButton } from './RandomizePromptButton'
import styles from './WindowBody.module.scss'

const Text_Internal = ({
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
const Text = React.memo(Text_Internal)

const Prompt_Internal: React.FC<{ value: string; windowId: string }> = ({
  value,
  windowId,
}) => {
  const textRef = React.useRef(value)
  const state = useZ([`editItemContent`, `editItem`, `fetchRealtimeImage`])
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
const Prompt = React.memo(Prompt_Internal)

const GeneratorBody_Internal: React.FC<{
  id: string
  isPinned: boolean
}> = ({ id, isPinned }) => {
  const state = useZ((state) => ({
    item: findItem(state.items, id) as ItemWithSpecificBody<`generator`>,
  }))
  return (
    <>
      <Prompt value={state.item.body.prompt} windowId={id} />
      <Canvas isPinned={isPinned} id={id} content={state.item.body.base64} />
    </>
  )
}
const GeneratorBody = React.memo(GeneratorBody_Internal)

const Modifier_Internal: React.FC<{
  value: string
  windowId: string
}> = ({ value, windowId }) => {
  const textRef = React.useRef(value)
  const state = useZ([
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
const Modifier = React.memo(Modifier_Internal)

const GeneratedBody_Internal: React.FC<{
  id: string
  isPinned: boolean
}> = ({ isPinned, id }) => {
  const state = useZ([`fullScreenWindow`], (state) => ({
    window: findWindow(state.windows, id),
    item: findItem(state.items, id) as ItemWithSpecificBody<`generated`>,
  }))
  const attributes = returnCanvasAttributes(
    state.window,
    null,
    state.fullScreenWindow === id,
    isPinned,
  )
  return (
    <>
      <Modifier value={state.item.body.modifier} windowId={id} />
      <div
        className={styles.imageContainer}
        style={{
          width: attributes.width,
          height: attributes.height,
        }}
      >
        {state.item.body.base64 !== `` && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.image}
              src={state.item.body.base64}
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
const GeneratedBody = React.memo(GeneratedBody_Internal)

const WindowBody_Internal: React.FC<{
  id: string
  isPinned: boolean
}> = ({ id, isPinned }) => {
  const state = useZ((state) => ({
    itemBodyType: findItem(state.items, id)?.body.type,
  }))
  return (
    <>
      {match(state.itemBodyType)
        .with(`generator`, (body) => (
          <GeneratorBody id={id} isPinned={isPinned} />
        ))
        .with(`generated`, (body) => (
          <GeneratedBody id={id} isPinned={isPinned} />
        ))
        .otherwise(() => null)}
    </>
  )
}

export const WindowBody = React.memo(WindowBody_Internal)
