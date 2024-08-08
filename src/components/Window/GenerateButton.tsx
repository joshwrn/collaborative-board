import React from 'react'
import style from './GenerateButton.module.scss'
import { Item } from '@/state/items'
import { motion } from 'framer-motion'
import { joinClasses } from '@/utils/joinClasses'
import { useConvertSketchToImage } from '@/fal/workflows/convertSketchToImage'

import { IoSparklesSharp } from 'react-icons/io5'
import { nanoid } from 'nanoid'
import { useStore } from '@/state/gen-state'

export const GenerateButton: React.FC<{
  item: Item
}> = ({ item }) => {
  const generateImage = useConvertSketchToImage({ item })
  const toastId = React.useRef<string>(nanoid())
  const state = useStore(['promiseNotification'])
  return (
    <section className={style.wrapper}>
      <motion.button
        onClick={async () => {
          toastId.current = nanoid()
          state.promiseNotification(
            async () => {
              await generateImage.mutateAsync({
                toastId: toastId.current,
              })
            },
            {
              type: 'info',
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
        }}
        className={joinClasses(generateImage.isPending && style.isPending)}
      >
        <p>Generate</p>
        <IoSparklesSharp />
      </motion.button>
    </section>
  )
}
