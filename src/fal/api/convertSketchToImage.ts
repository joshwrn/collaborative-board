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
import {
  creativeUpscale,
  CreativeUpscaleOutput,
  MOCK_CREATIVE_UPSCALE_RESPONSE,
} from './creativeUpscale'

export const mock_convertSketchToImageResponse = {
  description: 'A tiger is standing in a forest.',
  image: MOCK_CREATIVE_UPSCALE_RESPONSE.image,
}

export type ConvertSketchToImageResponse = {
  image: CreativeUpscaleOutput['image']
  description: string
}

export const convertSketchToImage = async ({
  sketch_url,
  style,
}: {
  sketch_url: string
  style?: string
}): Promise<ConvertSketchToImageResponse> => {
  const image = await creativeUpscale({
    image_url: sketch_url,
    creativity: 0.75,
    detail: 1.1,
    numInferenceSteps: 30,
    guidanceScale: 1,
    prompt: style,
  })
  return {
    image: image.image,
    description: style ?? '',
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
      const res = await fetchImageUrlToBase64({
        url: data.image.url,
      })
      const canvasId = nanoid()

      // resize image
      const img = new Image()
      img.src = res.base64
      img.onload = () => {
        if (!createdId.current) {
          throw new Error(`Created id not found.`)
        }

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error(`Canvas context not found.`)

        const resizedDimensions = {
          width: img.width / 2,
          height: img.height / 2,
        }
        canvas.width = resizedDimensions.width
        canvas.height = resizedDimensions.height

        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          0,
          0,
          resizedDimensions.width,
          resizedDimensions.height,
        )
        const base64 = canvas.toDataURL()

        state.addContentToItem(createdId.current, {
          type: 'canvas',
          id: canvasId,
          content: {
            base64: base64,
          },
        })
        state.setGeneratedCanvas({
          canvasId,
          itemId: createdId.current,
          lastDrawnAt: Date.now(),
          description: data.description,
          generatedFromItemId: item.id,
        })
      }
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
