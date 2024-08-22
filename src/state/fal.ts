import { z } from 'zod'

import type { AppStateCreator } from './state'

export interface FalStore {
  showFalSettingsModal: boolean
  fal_num_inference_steps: number
  fal_guidance_scale: number
  fal_detail: number
  fal_shape_preservation: number
  fal_creativity: number
  resetFalSettings: () => void
  updateFalSettings: (settings: FalSettingsInput) => void
}

export const falSettingsSchema = z.object({
  num_inference_steps: z
    .number()
    .min(1)
    .max(200)
    .describe(
      `The number of inference steps to use for generating the image. The more steps the better the image will be but it will also take longer to generate.`,
    ),
  guidance_scale: z
    .number()
    .min(0)
    .max(16)
    .describe(
      `The CFG (Classifier Free Guidance) scale is a measure of how close you want the model to stick to your prompt when looking for a related image to show you.`,
    ),
  detail: z.number().min(0).max(5).describe(`How much detail to add.`),
  shape_preservation: z
    .number()
    .min(0)
    .max(3)
    .describe(`How much to preserve the shape of the original image.`),
  creativity: z
    .number()
    .min(0)
    .max(1)
    .describe(`How much the output can deviate from the original.`),
})

const falSettingsInputSchema = falSettingsSchema.partial()
type FalSettingsInput = z.infer<typeof falSettingsInputSchema>

export type FalSettings = z.infer<typeof falSettingsSchema>

const DEFAULT_FAL_SETTINGS: FalSettings = {
  num_inference_steps: 20,
  guidance_scale: 7.5,
  detail: 1.1,
  shape_preservation: 0.25,
  creativity: 0.75,
}

export const falStore: AppStateCreator<FalStore> = (set, get) => ({
  fal_num_inference_steps: 20,
  fal_guidance_scale: 7.5,
  fal_detail: 1.1,
  fal_shape_preservation: 0.25,
  fal_creativity: 0.75,
  showFalSettingsModal: false,
  updateFalSettings: (settings) => {
    try {
      const parsedSettings = falSettingsInputSchema.parse(settings)
      const state = get()
      state.setState((draft: FalStore) => {
        for (const [key, value] of Object.entries(parsedSettings)) {
          // @ts-expect-error - is the key
          draft[`fal_${key}`] = value
        }
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(error.errors)
        return
      }
      return
    }
  },
  resetFalSettings: () => {
    const state = get()
    state.setState((draft) => {
      for (const [key, value] of Object.entries(DEFAULT_FAL_SETTINGS)) {
        // @ts-expect-error - is the key
        draft[`fal_${key}`] = value
      }
    })
  },
})
