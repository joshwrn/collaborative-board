import React from 'react'
import style from './GenerateButton.module.scss'
import { useMutation } from '@tanstack/react-query'
import { Item } from '@/state/items'
import { motion } from 'framer-motion'
import { joinClasses } from '@/utils/joinClasses'
import { useAppStore } from '@/state/gen-state'
import { useShallow } from 'zustand/react/shallow'
import { nanoid } from 'nanoid'
import { convertImageToBase64 } from '@/utils/convertImageToBase64'
import {
  GenerateImageResponse,
  fetchGenerateImage,
} from '@/server/create/fetchGenerateImage'
import { fetchImageUrlToBlob } from '@/server/imageUrlToBlob/fetchImageUrlToBlob'

export const GenerateButton: React.FC<{
  item: Item
}> = ({ item }) => {
  const state = useAppStore(
    useShallow((state) => ({
      createItem: state.createItem,
      makeConnection: state.makeConnection,
      toggleOpenWindow: state.toggleOpenWindow,
      addContentToItem: state.addContentToItem,
      deleteItem: state.deleteItem,
    })),
  )
  const createdId = React.useRef<string | null>(null)
  const generateImage = useMutation<GenerateImageResponse>({
    mutationFn: async () => {
      const image = item.body.find((b) => b.type === 'canvas')?.content.blob
      const prompt = item.body.find((b) => b.type === 'text')?.content
      if (!image || !prompt) {
        throw new Error(`no image or prompt`)
      }
      return await fetchGenerateImage({
        base64: image,
        prompt,
      })
    },
    onMutate: () => {
      const id = nanoid()
      createdId.current = id
      state.createItem({
        id: id,
        subject: `generated from ${item.subject}`,
      })
      state.makeConnection({
        to: id,
        from: item.id,
      })
      state.toggleOpenWindow(id)
    },
    onSuccess: async (data) => {
      if (!createdId.current) {
        throw new Error(`no id`)
      }
      console.log('data: ', data.generatedImage)
      const res = await fetchImageUrlToBlob({
        url: data.generatedImage,
      })
      console.log('res: ', res)
      state.addContentToItem(createdId.current, {
        type: 'canvas',
        id: nanoid(),
        content: {
          blob: res.base64,
        },
      })
    },
    onError: () => {
      if (!createdId.current) {
        throw new Error(`no id`)
      }
      state.deleteItem(createdId.current)
    },
  })

  return (
    <section className={style.wrapper}>
      <motion.button
        onClick={async () => generateImage.mutateAsync()}
        className={joinClasses(generateImage.isPending && style.isPending)}
      >
        <p>Generate</p>
      </motion.button>
    </section>
  )
}
