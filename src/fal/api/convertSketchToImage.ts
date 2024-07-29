import { useMutation } from '@tanstack/react-query'
import { describeImage } from './describeImage'
import {
  imageToImage,
  ImageToImageResponse,
  MOCK_IMAGE_TO_IMAGE_RESPONSE,
} from './imageToImage'
import { Item } from '@/state/items'
import React from 'react'
import { nanoid } from 'nanoid'
import { fetchImageUrlToBase64 } from '@/server/imageUrlToBase64/fetchImageUrlToBase64'
import { useShallowAppStore } from '@/state/gen-state'

export const mock_convertSketchToImageResponse = {
  description: 'A tiger is standing in a forest.',
  image: MOCK_IMAGE_TO_IMAGE_RESPONSE,
}

export type ConvertSketchToImageResponse = {
  image: ImageToImageResponse
  description: string
}

export const convertSketchToImage = async ({
  sketch_url,
  style,
}: {
  sketch_url: string
  style?: string
}): Promise<ConvertSketchToImageResponse> => {
  const description = await describeImage({
    image_url: sketch_url,
  })
  const image = await imageToImage({
    image_url: sketch_url,
    prompt: `Convert this sketch to a ${
      style ?? 'watercolor painting'
    }, using the following description: ${description.output}`,
    num_inference_steps: 64,
    guidance_scale: 20,
    strength: 1,
  })
  return {
    image,
    description: description.output,
  }
}

const should_use_mock = false

export const useConvertSketchToImage = ({ item }: { item: Item }) => {
  const state = useShallowAppStore([
    'createItem',
    'makeConnection',
    'toggleOpenWindow',
    'addContentToItem',
    'moveWindowNextTo',
    'deleteItem',
    'setGeneratedCanvas',
  ])
  const createdId = React.useRef<string | null>(null)
  const generateImage = useMutation<ConvertSketchToImageResponse>({
    mutationFn: async () => {
      if (should_use_mock) {
        console.log('useConvertSketchToImage', 'use_mock')
        return mock_convertSketchToImageResponse
      }
      const image = item.body.find((b) => b.type === 'canvas')?.content.base64
      const style = item.body.find((b) => b.type === 'text')?.content
      if (!image) {
        throw new Error(`Missing image or prompt.`)
      }
      const result = await convertSketchToImage({
        sketch_url: image,
        style,
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
        throw new Error(`Data not found.`)
      }
      if (!createdId.current) {
        throw new Error(`Created id not found.`)
      }
      const res = await fetchImageUrlToBase64({
        url: data.image.images[0].url,
      })
      const canvasId = nanoid()
      state.addContentToItem(createdId.current, {
        type: 'canvas',
        id: canvasId,
        content: {
          base64: res.base64,
        },
      })
      state.setGeneratedCanvas({
        canvasId,
        itemId: createdId.current,
        lastDrawnAt: Date.now(),
        description: data.description,
        generatedFromItemId: item.id,
      })
    },
    onError: () => {
      if (!createdId.current) {
        throw new Error(`Created id not found.`)
      }
      state.deleteItem(createdId.current)
    },
  })

  return generateImage
}
