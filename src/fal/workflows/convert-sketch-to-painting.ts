import { useMutation } from '@tanstack/react-query'

import { useStore } from '@/state/gen-state'
import { useWithRateLimit } from '@/utils/useWithRateLimit'

import { optimizedConsistentLatency } from '../optimized-consistent-latency'

export const useConvertSketchToImage = () => {
  const state = useStore([
    `setState`,
    `findGeneratorItems`,
    `editItemContent`,
    `findGeneratedItems`,
    `findItemToUpdate`,
    `discoverFalSettings`,
    `timedNotification`,
    `findParentItem`,
  ])
  const [disabled, limit] = useWithRateLimit()
  const generateImageMutation = useMutation<
    { image: string },
    Error,
    { itemToUpdateId: string; generatedFromItemId: string }
  >({
    mutationFn: async ({ itemToUpdateId, generatedFromItemId }) => {
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
        const result = await optimizedConsistentLatency(
          {
            seed: 42,
            enable_safety_checks: false,
            image_url: generatedFromItem.body.base64,
            prompt: generatedFromItem.body.prompt,
            strength: falSettings.strength,
            num_inference_steps: falSettings.num_inference_steps,
            guidance_scale: falSettings.guidance_scale,
          },
          (update) => {
            console.log(`update`, update)
          },
        )
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
    onError: (e, { generatedFromItemId }) => {
      state.setState((draft) => {
        draft.loadingItemId = null
      })
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      state.timedNotification({
        notification: {
          id: `${generatedFromItemId}-error`,
          type: `error`,
          message: `Failed to generate image`,
        },
      })
      throw new Error(`Failed to generate image: ${e.message}`)
    },
  })

  const generateImage = async ({
    generatedFromItemId,
  }: {
    generatedFromItemId: string
  }) => {
    const itemToUpdateId = state.findItemToUpdate(generatedFromItemId).id
    if (!disabled) {
      await limit(
        async () =>
          generateImageMutation.mutateAsync({
            itemToUpdateId: itemToUpdateId,
            generatedFromItemId,
          }),
        1000,
      )
    }
  }

  return generateImage
}
