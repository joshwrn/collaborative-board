import { motion } from 'framer-motion'
import { nanoid } from 'nanoid'
import React from 'react'
import { IoSparklesSharp } from 'react-icons/io5'

import { useConvertSketchToImage } from '@/fal/workflows/convertSketchToImage'
import { useStore } from '@/state/gen-state'
import type { Item } from '@/state/items'
import { joinClasses } from '@/utils/joinClasses'
import { useWithRateLimit } from '@/utils/useWithRateLimit'

import style from './GenerateButton.module.scss'

export const GenerateButton_Internal: React.FC<{
  item: Item
}> = ({ item }) => {
  const generateImage = useConvertSketchToImage({ generatedFromItem: item })
  const toastId = React.useRef<string>(nanoid())
  const state = useStore([`promiseNotification`])
  const [disabled, limit] = useWithRateLimit()
  return (
    <section className={style.wrapper}>
      <motion.button
        onClick={() => {
          limit(async () => {
            toastId.current = nanoid()
            await state.promiseNotification(
              async () => {
                await generateImage.mutateAsync({
                  toastId: toastId.current,
                })
              },
              {
                type: `info`,
                message: `In Queue...`,
                id: toastId.current,
                isLoading: true,
              },
              {
                onSuccess: {
                  update: {
                    message: `Image generated!`,
                  },
                },
              },
            )
          }, 2000)
        }}
        className={joinClasses(
          generateImage.isPending && style.isPending,
          disabled && style.isDisabled,
        )}
      >
        <p>Generate</p>
        <IoSparklesSharp />
      </motion.button>
    </section>
  )
}

export const GenerateButton = React.memo(GenerateButton_Internal)
