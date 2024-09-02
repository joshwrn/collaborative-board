import { motion } from 'framer-motion'
import { nanoid } from 'nanoid'
import React, { useContext } from 'react'
import { IoSparklesSharp } from 'react-icons/io5'

import { useConvertSketchToImage } from '@/fal/workflows/convertSketchToImage'
import { LiveImageContext } from '@/fal/workflows/realTimeConvertSketchToImage'
import { useStore } from '@/state/gen-state'
import type { Item } from '@/state/items'
import { joinClasses } from '@/utils/joinClasses'
import { useWithRateLimit } from '@/utils/useWithRateLimit'

import style from './GenerateButton.module.scss'

export const GenerateButton_Internal: React.FC<{
  item: Item
}> = ({ item }) => {
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
        onClick={async () => {
          if (!fetchImage) {
            return
          }
          await fetchImage({
            prompt: prompt ?? ``,
            image_url: base64 ?? ``,
            strength: 0.8,
            seed: 42,
            enable_safety_checks: true,
            sync_mode: true,
          })
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
