import { useMutation } from '@tanstack/react-query'
import {
  imageToImage,
  ImageToImageResponse,
  MOCK_IMAGE_TO_IMAGE_RESPONSE,
} from './imageToImage'
import { fetchImageUrlToBase64 } from '@/server/imageUrlToBase64/fetchImageUrlToBase64'
import { useShallowAppStore } from '@/state/gen-state'

export const iterateOnSketch = async ({
  sketch_url,
  style,
  description,
}: {
  sketch_url: string
  style?: string
  description: string
}): Promise<ImageToImageResponse> => {
  const image = await imageToImage({
    image_url: sketch_url,
    prompt: `Convert this sketch to a ${
      style ?? 'watercolor painting'
    }, using the following description: ${description}`,
    num_inference_steps: 2,
    guidance_scale: 2,
    strength: 1,
  })
  return image
}

const should_use_mock = true

export const useIterateOnSketch = ({ base64 }: { base64: string }) => {
  const state = useShallowAppStore(['editItemContent', 'generatedCanvas'])
  const generateImage = useMutation<ImageToImageResponse>({
    mutationFn: async () => {
      if (should_use_mock) {
        console.log('useIterateOnSketch', 'use_mock')
        return MOCK_IMAGE_TO_IMAGE_RESPONSE
      }
      if (!state?.generatedCanvas) {
        throw new Error(`Generated canvas not found.`)
      }
      const result = await iterateOnSketch({
        sketch_url: base64,
        description: state.generatedCanvas.description,
        style: state.generatedCanvas.style,
      })
      console.log('iterateOnSketch', result)
      return result
    },
    onMutate: () => {},
    onSuccess: async (data) => {
      if (!data) {
        throw new Error(`Data not found.`)
      }
      if (!state?.generatedCanvas) {
        throw new Error(`Generated canvas not found.`)
      }
      const res = await fetchImageUrlToBase64({
        url: data.images[0].url,
      })
      state.editItemContent(state.generatedCanvas.itemId, {
        type: 'canvas',
        id: state.generatedCanvas.canvasId,
        content: {
          base64: res.base64,
        },
      })
    },
    onError: (e) => {
      console.log('onError', e)
    },
  })

  return generateImage
}
