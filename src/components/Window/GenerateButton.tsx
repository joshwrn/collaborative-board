import React from 'react'
import style from './GenerateButton.module.scss'
import { Item } from '@/state/items'
import { motion } from 'framer-motion'
import { joinClasses } from '@/utils/joinClasses'
import { useConvertSketchToImage } from '@/fal/api/convertSketchToImage'
import { toast } from 'react-toastify'

import { IoSparklesSharp } from 'react-icons/io5'
import { nanoid } from 'nanoid'

export const GenerateButton: React.FC<{
  item: Item
}> = ({ item }) => {
  const generateImage = useConvertSketchToImage({ item })
  const toastId = React.useRef<string>(nanoid())
  return (
    <section className={style.wrapper}>
      <motion.button
        onClick={async () => {
          toastId.current = nanoid()
          generateImage.mutateAsync({ toastId: toastId.current })
          toast.loading('In queue...', {
            toastId: toastId.current,
          })
        }}
        className={joinClasses(generateImage.isPending && style.isPending)}
      >
        <p>Generate</p>
        <IoSparklesSharp />
      </motion.button>
    </section>
  )
}
