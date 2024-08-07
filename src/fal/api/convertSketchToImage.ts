import { useMutation } from '@tanstack/react-query'
import { Item } from '@/state/items'
import { nanoid } from 'nanoid'
import { fetchImageUrlToBase64 } from '@/server/imageUrlToBase64/fetchImageUrlToBase64'
import { useFullStore, useStore } from '@/state/gen-state'
import {
  creativeUpscale,
  CreativeUpscaleOutput,
  MOCK_CREATIVE_UPSCALE_RESPONSE,
} from './creativeUpscale'
import { resizeImage } from '@/utils/image/resizeImage'
import { toast } from 'react-toastify'
import * as fal from '@fal-ai/serverless-client'
import { mockProgress } from '@/mock/mock-progress'

export const createFakeMockConvertSketchToImageResponse = ({
  itemId,
}: {
  itemId: string
}) => {
  return {
    description: 'A tiger is standing in a forest.',
    image: MOCK_CREATIVE_UPSCALE_RESPONSE.image,
    itemId,
  }
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
  onUpdate,
}: {
  sketch_url: string
  style?: string
  itemId: string
  onUpdate: (update: any) => void
}): Promise<ConvertSketchToImageResponse> => {
  const image = await creativeUpscale({
    image_url: sketch_url,
    creativity: 0.75,
    detail: 1.1,
    numInferenceSteps: 30,
    guidanceScale: 1,
    prompt: style,
    onUpdate,
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
    'setState',
    'removeGeneratingCanvasItem',
    'updateGeneratingCanvasProgress',
  ])
  const generateImage = useMutation<
    ConvertSketchToImageResponse,
    Error,
    {
      toastId: string
    }
  >({
    mutationFn: async ({ toastId }: { toastId: string }) => {
      const id = nanoid()
      const connections = useFullStore.getState().connections
      const outgoingConnections = connections.filter(
        (connection) => connection.from === item.id,
      )
      state.createItem({
        id: id,
        subject: `${item.subject} - v${outgoingConnections.length + 2}`,
      })
      state.makeConnection({
        to: id,
        from: item.id,
      })
      state.setState((draft) => {
        draft.generatingCanvas = [
          ...draft.generatingCanvas,
          { itemId: id, progress: 0 },
        ]
      })
      state.toggleOpenWindow(id)
      state.moveWindowNextTo(item.id, id)

      if (should_use_mock) {
        console.log('useConvertSketchToImage', 'use_mock')
        const mock_progress = await mockProgress(1000, (progress) => {
          toast.update(toastId, {
            progress,
          })
          state.updateGeneratingCanvasProgress(id, progress)
        })
        if (mock_progress === 'success') {
          // need to do two updates because the toast disappears immediately when set to 1
          toast.update(toastId, {
            render: 'Image generated!',
            type: 'success',
            progress: 0.99,
            isLoading: false,
          })
          toast.update(toastId, {
            progress: 1,
            type: 'success',
            render: 'Image generated!',
            delay: 1000,
            isLoading: false,
          })
        }
        return createFakeMockConvertSketchToImageResponse({ itemId: id })
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
          onUpdate: (update: fal.QueueStatus) => {
            if (update.status === 'IN_PROGRESS') {
              let progress = 0
              if (update.logs) {
                update.logs
                  .map((log) => log.message)
                  .forEach((message) => {
                    const newProgress = progress + 0.01
                    progress = newProgress >= 0.95 ? 0.95 : newProgress
                  })
              }
              toast.update(toastId, {
                progress,
              })
              state.updateGeneratingCanvasProgress(id, progress)
            }

            if (update.status === 'COMPLETED') {
              toast.update(toastId, {
                render: 'Image generated!',
                type: 'success',
                progress: 1,
                isLoading: false,
              })
            }
          },
        })
        return result
      } catch (e) {
        console.error(e)
        state.removeGeneratingCanvasItem(id)
        state.deleteItem(id)
        toast.update(toastId, {
          render: 'Failed to generate image',
          type: 'error',
          progress: 1,
          isLoading: false,
        })
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
          state.addContentToItem(data.itemId, [
            {
              type: 'text',
              id: nanoid(),
              content: data.description,
            },
            {
              type: 'canvas',
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
              generatedFromItemId: item.id,
            }
          })
          state.removeGeneratingCanvasItem(data.itemId)
        },
      })
    },
    onError: (e) => {
      throw new Error(`Failed to generate image: ${e}`)
    },
  })

  return generateImage
}
