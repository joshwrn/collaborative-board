import { useMutation } from '@tanstack/react-query'
import { Item } from '@/state/items'
import React from 'react'
import { nanoid } from 'nanoid'
import { fetchImageUrlToBase64 } from '@/server/imageUrlToBase64/fetchImageUrlToBase64'
import { useStore } from '@/state/gen-state'
import {
  creativeUpscale,
  CreativeUpscaleOutput,
  MOCK_CREATIVE_UPSCALE_RESPONSE,
} from './creativeUpscale'
import { resizeImage } from '@/utils/image/resizeImage'

export const mock_convertSketchToImageResponse = {
  description: 'A tiger is standing in a forest.',
  image: MOCK_CREATIVE_UPSCALE_RESPONSE.image,
  itemId: 'fake-item-id',
}

export type ConvertSketchToImageResponse = {
  image: CreativeUpscaleOutput['image']
  description: string
  itemId: string
}

export const convertSketchToImage = async ({
  sketch_url,
  style,
  itemId,
}: {
  sketch_url: string
  style?: string
  itemId: string
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
    itemId,
  }
}

const should_use_mock = false

export const useConvertSketchToImage = ({ item }: { item: Item }) => {
  const state = useStore([
    'createItem',
    'makeConnection',
    'toggleOpenWindow',
    'addContentToItem',
    'moveWindowNextTo',
    'deleteItem',
    'setGeneratedCanvas',
    'setGeneratingCanvas',
  ])
  const generateImage = useMutation<ConvertSketchToImageResponse>({
    mutationFn: async () => {
      const id = nanoid()
      state.createItem({
        id: id,
        subject: `generated from ${item.subject}`,
      })
      state.makeConnection({
        to: id,
        from: item.id,
      })
      state.setGeneratingCanvas((prev) => [...prev, id])
      state.toggleOpenWindow(id)
      state.moveWindowNextTo(item.id, id)

      if (should_use_mock) {
        console.log('useConvertSketchToImage', 'use_mock')
        return mock_convertSketchToImageResponse
      }

      try {
        const image = item.body.find((b) => b.type === 'canvas')?.content.base64
        const style = item.body.find((b) => b.type === 'text')?.content
        if (!image) {
          throw new Error(`Missing image or prompt.`)
        }
        const result = await convertSketchToImage({
          sketch_url: image,
          style,
          itemId: id,
        })
        console.log(result)
        return result
      } catch (e) {
        console.error(e)
        state.setGeneratingCanvas((prev) => prev.filter((i) => i !== id))
        state.deleteItem(id)
        throw e
      }
    },
    onSuccess: async (data) => {
      const res = await fetchImageUrlToBase64({
        url: data.image.url,
      })
      resizeImage({
        base64: res.base64,
        width: data.image.width / 2,
        height: data.image.height / 2,
        onSuccess: (base64) => {
          const canvasId = nanoid()
          state.addContentToItem(data.itemId, {
            type: 'canvas',
            id: canvasId,
            content: {
              base64: base64,
            },
          })
          state.setGeneratedCanvas({
            canvasId,
            itemId: data.itemId,
            generatedFromItemId: item.id,
          })
          state.setGeneratingCanvas((prev) =>
            prev.filter((i) => i !== data.itemId),
          )
        },
      })
    },
    onError: (e) => {
      throw new Error(`Failed to generate image: ${e}`)
    },
  })

  return generateImage
}
