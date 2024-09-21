import { useMutation } from '@tanstack/react-query'

import { fetchImageUrlToBase64 } from '@/server/imageUrlToBase64/fetchImageUrlToBase64'
import { useStore } from '@/state/gen-state'

import { optimizedConsistentLatency } from '../optimized-consistent-latency'

export const useConvertSketchToImage = ({
  generatedFromItemId,
}: {
  generatedFromItemId: string
}) => {
  const state = useStore([
    `setState`,
    `findGeneratorItems`,
    `editItemContent`,
    `findGeneratedItems`,
    `findItemToUpdate`,
    `discoverFalSettings`,
    `createNotification`,
  ])
  const generateImage = useMutation<{ image: any }>({
    mutationFn: async () => {
      try {
        const generatedFromItem = state
          .findGeneratorItems()
          .find((i) => i.id === generatedFromItemId)
        if (!generatedFromItem) {
          throw new Error(`generatedFromItem not found`)
        }
        const itemToUpdate = state.findItemToUpdate(generatedFromItemId)
        const falSettings = state.discoverFalSettings(itemToUpdate.id)
        const result = await optimizedConsistentLatency({
          seed: 42,
          enable_safety_checks: false,
          image_url: generatedFromItem.body.base64,
          prompt: generatedFromItem.body.prompt,
          strength: falSettings.strength,
          num_inference_steps: falSettings.num_inference_steps,
          guidance_scale: falSettings.guidance_scale,
        })
        return {
          image: result.images[0].url,
        }
      } catch (e) {
        console.error(e)
        state.createNotification({
          id: `${generatedFromItemId}-error`,
          type: `error`,
          message: `Failed to generate image`,
        })
        throw e
      }
    },
    onSuccess: (data) => {
      const itemToUpdate = state.findItemToUpdate(generatedFromItemId)
      state.editItemContent(itemToUpdate.id, {
        base64: data.image,
      })
    },
    onError: (e) => {
      throw new Error(`Failed to generate image: ${e.message}`)
    },
  })

  return generateImage
}
