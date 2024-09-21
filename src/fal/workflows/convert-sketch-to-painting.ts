import { useMutation } from '@tanstack/react-query'

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
  const generateImage = useMutation<
    { image: string },
    Error,
    { itemToUpdateId: string }
  >({
    mutationFn: async ({ itemToUpdateId }) => {
      try {
        state.setState((draft) => {
          draft.loadingItemId = itemToUpdateId
        })
        const generatedFromItem = state
          .findGeneratorItems()
          .find((i) => i.id === generatedFromItemId)
        if (!generatedFromItem) {
          throw new Error(`generatedFromItem not found`)
        }
        const falSettings = state.discoverFalSettings(itemToUpdateId)
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
        throw e
      }
    },
    onSuccess: (data, { itemToUpdateId }) => {
      state.editItemContent(itemToUpdateId, {
        base64: data.image,
      })
      state.setState((draft) => {
        draft.loadingItemId = null
      })
    },
    onError: (e) => {
      state.setState((draft) => {
        draft.loadingItemId = null
      })
      state.createNotification({
        id: `${generatedFromItemId}-error`,
        type: `error`,
        message: `Failed to generate image`,
      })
      throw new Error(`Failed to generate image: ${e.message}`)
    },
  })

  return generateImage
}
