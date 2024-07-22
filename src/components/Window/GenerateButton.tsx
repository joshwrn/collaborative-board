import React from 'react'
import style from './GenerateButton.module.scss'
import { useMutation } from '@tanstack/react-query'
import { Item } from '@/state/items'
import { motion } from 'framer-motion'
import { joinClasses } from '@/utils/joinClasses'
import { useAppStore } from '@/state/gen-state'
import { useShallow } from 'zustand/react/shallow'
import { nanoid } from 'nanoid'
import { blobToBase64 } from '@/utils/blobToBase64'
import { fetchImageAsBlob } from '@/utils/fetchImageAsBlob'

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
  const generateImage = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/create', {
        method: 'POST',
        body: JSON.stringify({
          image: item.body.find((b) => b.type === 'canvas')?.content.blob,
          prompt: item.body.find((b) => b.type === 'text')?.content,
        }),
      })
      const json = await res.json()
      return json
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
      const blob = await fetchImageAsBlob(data.generatedImage)
      const base64 = await blobToBase64(blob)
      state.addContentToItem(createdId.current, {
        type: 'canvas',
        id: nanoid(),
        content: {
          blob: base64,
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
