import React from 'react'
import style from './GenerateButton.module.scss'
import { useMutation } from '@tanstack/react-query'
import { Item } from '@/state/items'
import { motion } from 'framer-motion'
import { joinClasses } from '@/utils/joinClasses'
import { useAppStore } from '@/state/gen-state'
import { useShallow } from 'zustand/react/shallow'
import { nanoid } from 'nanoid'
import { fetchImageUrlToBase64 } from '@/server/imageUrlToBase64/fetchImageUrlToBase64'
import { convertSketchToImage } from '@/fal/api/convertSketchToImage'
import {
  ImageToImageResponse,
  mock_imageToImageResponse,
} from '@/fal/api/imageToImage'

const should_use_mock = true

export const GenerateButton: React.FC<{
  item: Item
}> = ({ item }) => {
  const state = useAppStore(
    useShallow((state) => ({
      createItem: state.createItem,
      makeConnection: state.makeConnection,
      toggleOpenWindow: state.toggleOpenWindow,
      addContentToItem: state.addContentToItem,
      moveWindowNextTo: state.moveWindowNextTo,
      deleteItem: state.deleteItem,
    })),
  )
  const createdId = React.useRef<string | null>(null)
  const generateImage = useMutation<ImageToImageResponse>({
    mutationFn: async () => {
      if (should_use_mock) {
        return mock_imageToImageResponse
      }

      const image = item.body.find((b) => b.type === 'canvas')?.content.base64
      const prompt = item.body.find((b) => b.type === 'text')?.content
      if (!image || !prompt) {
        throw new Error(`no image or prompt`)
      }
      const result = await convertSketchToImage({
        sketch_url: image,
        style: prompt,
        description_prompt: '',
      })
      console.log(result)
      return result
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
      state.moveWindowNextTo(item.id, id)
    },
    onSuccess: async (data) => {
      if (!data) {
        throw new Error(`no data`)
      }
      if (!createdId.current) {
        throw new Error(`no id`)
      }
      console.log('data: ', data.images[0].url)
      const res = await fetchImageUrlToBase64({
        url: data.images[0].url,
      })
      console.log('res: ', res)
      state.addContentToItem(createdId.current, {
        type: 'canvas',
        id: nanoid(),
        content: {
          base64: res.base64,
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
