import type * as fal from '@fal-ai/serverless-client'
import { useMutation } from '@tanstack/react-query'
import { nanoid } from 'nanoid'

import { mockProgress } from '@/mock/mock-progress'
import { fetchImageUrlToBase64 } from '@/server/imageUrlToBase64/fetchImageUrlToBase64'
import { useFullStore, useStore } from '@/state/gen-state'
import type { Item } from '@/state/items'

import type { CreativeUpscaleOutput } from '../api/creativeUpscale'
import {
  creativeUpscale,
  MOCK_CREATIVE_UPSCALE_RESPONSE,
} from '../api/creativeUpscale'

export const createFakeMockConvertSketchToImageResponse = ({
  itemId,
}: {
  itemId: string
}) => {
  return {
    description: `A tiger is standing in a forest.`,
    image: MOCK_CREATIVE_UPSCALE_RESPONSE.image,
    itemId,
  }
}

export interface ConvertSketchToImageResponse {
  image: CreativeUpscaleOutput[`image`]
  description: string
  itemId: string
}

const USE_MOCK = false

export const useConvertSketchToImage = ({
  generatedFromItem,
}: {
  generatedFromItem: Item
}) => {
  const state = useStore([
    `createItem`,
    `makeConnection`,
    `toggleOpenWindow`,
    `addContentToItem`,
    `moveWindowNextTo`,
    `deleteItem`,
    `setState`,
    `removeGeneratingCanvasItem`,
    `updateGeneratingCanvasProgress`,
    `updateNotification`,
    `fal_num_inference_steps`,
  ])
  const generateImage = useMutation<
    ConvertSketchToImageResponse,
    Error,
    {
      toastId: string
    }
  >({
    mutationFn: async ({ toastId }) => {
      const newItemId = nanoid()
      const { connections } = useFullStore.getState()
      const outgoingConnections = connections.filter(
        (connection) => connection.from === generatedFromItem.id,
      )
      state.createItem({
        id: newItemId,
        subject: `${generatedFromItem.subject} - v${outgoingConnections.length + 2}`,
      })
      state.makeConnection({
        to: newItemId,
        from: generatedFromItem.id,
      })
      state.setState((draft) => {
        draft.generatingCanvas = [
          ...draft.generatingCanvas,
          {
            newItemId,
            generatedFromItemId: generatedFromItem.id,
            progress: 0,
          },
        ]
      })
      state.toggleOpenWindow(newItemId)
      state.moveWindowNextTo(generatedFromItem.id, newItemId)

      if (USE_MOCK) {
        await mockProgress({
          onProgress: (progress) => {
            state.updateNotification(toastId, {
              progress,
              message: `Generating...`,
            })
            state.updateGeneratingCanvasProgress(newItemId, progress)
          },
          time: 1000,
        })
        return createFakeMockConvertSketchToImageResponse({ itemId: newItemId })
      }

      try {
        const image = generatedFromItem.body.find((b) => b.type === `canvas`)
          ?.content.base64
        const style = generatedFromItem.body.find(
          (b) => b.type === `text`,
        )?.content
        if (!image) {
          throw new Error(`Missing image or prompt.`)
        }
        const result = await creativeUpscale({
          image_url: image,
          prompt: style,
          creativity: 0.75,
          scale: 1,
          detail: 1.1,
          num_inference_steps: state.fal_num_inference_steps,
          shape_preservation: 0.25,
          guidance_scale: 7.5,
          onUpdate: (update: fal.QueueStatus) => {
            if (update.status === `IN_PROGRESS`) {
              let progress = 0
              if (update.logs) {
                update.logs.forEach((message) => {
                  const newProgress = progress + 1
                  progress = newProgress >= 95 ? 95 : newProgress
                })
              }
              state.updateNotification(toastId, {
                progress: progress,
                message: `Generating...`,
              })
              state.updateGeneratingCanvasProgress(newItemId, progress)
            }
          },
        })
        return {
          image: result.image,
          description: style ?? ``,
          itemId: newItemId,
        }
      } catch (e) {
        console.error(e)
        state.removeGeneratingCanvasItem(newItemId)
        state.deleteItem(newItemId)
        throw e
      }
    },
    onSuccess: async (data) => {
      const res = await fetchImageUrlToBase64({
        url: data.image.url,
      })
      const { base64 } = res
      const canvasId = nanoid()
      state.addContentToItem(data.itemId, [
        {
          type: `text`,
          id: nanoid(),
          content: data.description,
        },
        {
          type: `canvas`,
          id: canvasId,
          content: {
            base64: base64,
          },
        },
      ])
      state.setState((draft) => {
        draft.generatedCanvas = {
          canvasId,
          itemId: data.itemId,
          generatedFromItemId: generatedFromItem.id,
        }
      })
      state.removeGeneratingCanvasItem(data.itemId)
    },
    onError: (e) => {
      throw new Error(`Failed to generate image: ${e.message}`)
    },
  })

  return generateImage
}
