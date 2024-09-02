import { motion } from 'framer-motion'
import { nanoid } from 'nanoid'
import React, { useContext } from 'react'
import { IoSparklesSharp } from 'react-icons/io5'

import { useConvertSketchToImage } from '@/fal/workflows/convertSketchToImage'
import { LiveImageContext } from '@/fal/workflows/realTimeConvertSketchToImage'
import { useFullStore, useStore } from '@/state/gen-state'
import type { Item } from '@/state/items'
import { joinClasses } from '@/utils/joinClasses'
import { useWithRateLimit } from '@/utils/useWithRateLimit'

import style from './GenerateButton.module.scss'

export const GenerateButton_Internal: React.FC<{
  item: Item
}> = ({ item }) => {
  const state = useStore([
    `moveWindowNextTo`,
    `createItem`,
    `makeConnection`,
    `setState`,
    `toggleOpenWindow`,
    `addContentToItem`,
  ])
  // const generateImage = useConvertSketchToImage({ generatedFromItem: item })
  const fetchImage = useContext(LiveImageContext)
  // const toastId = React.useRef<string>(nanoid())
  // const state = useStore([`promiseNotification`])
  // const [disabled, limit] = useWithRateLimit()
  const base64 = item.body.find((b) => b.type === `canvas`)?.content.base64
  const prompt = item.body.find((b) => b.type === `text`)?.content
  return (
    <section className={style.wrapper}>
      <motion.button
        onClick={() => {
          const newItemId = nanoid()
          const { connections } = useFullStore.getState()
          const outgoingConnections = connections.filter(
            (connection) => connection.from === item.id,
          )
          state.createItem({
            id: newItemId,
            subject: `${item.subject} - v${outgoingConnections.length + 2}`,
          })
          state.makeConnection({
            to: newItemId,
            from: item.id,
          })
          state.toggleOpenWindow(newItemId)
          state.moveWindowNextTo(item.id, newItemId)
          const canvasId = nanoid()
          state.addContentToItem(newItemId, [
            {
              type: `text`,
              id: nanoid(),
              content: prompt ?? ``,
            },
            {
              type: `canvas`,
              id: canvasId,
              content: {
                base64: ``,
              },
            },
          ])
        }}
        // className={joinClasses(
        //   generateImage.isPending && style.isPending,
        //   disabled && style.isDisabled,
        // )}
      >
        <p>Generate</p>
        <IoSparklesSharp />
      </motion.button>
    </section>
  )
}

export const GenerateButton = React.memo(GenerateButton_Internal)
