import React from 'react'
import style from './GenerateButton.module.scss'
import { Item } from '@/state/items'
import { motion } from 'framer-motion'
import { joinClasses } from '@/utils/joinClasses'
import { useConvertSketchToImage } from '@/fal/api/convertSketchToImage'
import { toast } from 'react-toastify'

export const GenerateButton: React.FC<{
  item: Item
}> = ({ item }) => {
  const generateImage = useConvertSketchToImage({ item })

  return (
    <section className={style.wrapper}>
      <motion.button
        onClick={async () => {
          toast.promise(generateImage.mutateAsync(), {
            pending: 'Generating...',
            success: 'Generated!',
            error: {
              render: ({ data }: { data: Error }) => {
                return data.message
              },
            },
          })
        }}
        className={joinClasses(generateImage.isPending && style.isPending)}
      >
        <p>Generate</p>
      </motion.button>
    </section>
  )
}
