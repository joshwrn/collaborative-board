import { nanoid } from 'nanoid'
import { z } from 'zod'

import type { AppStateCreator } from './state'

type LiveImageResult = { url: string }
type LiveImageRequest = {
  prompt: string
  image_url: string
  sync_mode: boolean
  strength: number
  seed: number
  enable_safety_checks: boolean
}
export interface FalStore {
  showFalSettingsModal: boolean
  fal_num_inference_steps: number
  fal_guidance_scale: number
  fal_detail: number
  fal_shape_preservation: number
  fal_creativity: number
  resetFalSettings: () => void
  updateFalSettings: (settings: FalSettingsInput) => void

  generateInitialWindow: (itemId: string) => Promise<void>
  fetchRealtimeImage: (itemId: string) => Promise<void>
  fetchRealtimeImageFn:
    | ((req: LiveImageRequest) => Promise<LiveImageResult>)
    | null
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

  fetchRealtimeImageFn: null,

  generateInitialWindow: async (itemId) => {
    const state = get()
    const newItemId = nanoid()
    const item = state.items.find((i) => i.id === itemId)
    if (item?.body.type !== `generator`) {
      return
    }
    const outgoingConnections = state.connections.filter(
      (connection) => connection.from === item.id,
    )
    state.createItem({
      id: newItemId,
      subject: `${item.subject} - v${outgoingConnections.length + 2}`,
    })
    state.makeConnection({
      to: newItemId,
      from: item.id,
    })
    state.toggleOpenWindow(newItemId)
    state.moveWindowNextTo(item.id, newItemId)
    const { prompt } = item.body
    state.editItemContent(newItemId, {
      prompt,
      base64: ``,
    })
    await state.fetchRealtimeImage(itemId)
  },

  fetchRealtimeImage: async (itemId) => {
    const state = get()
    if (!state.fetchRealtimeImageFn) {
      return
    }
    const item = state.items.find((i) => i.id === itemId)
    if (item?.body.type !== `generator`) {
      return
    }
    const { prompt } = item.body
    const { base64 } = item.body
    const img = await state.fetchRealtimeImageFn({
      prompt: prompt,
      image_url: base64,
      strength: 0.8,
      seed: 42,
      enable_safety_checks: false,
      sync_mode: true,
    })
    console.log(`img`, img)
    const itemToUpdateId = state.connections.find((c) => c.from === item.id)?.to
    if (!itemToUpdateId) {
      throw new Error(`itemToUpdateId not found`)
    }
    state.editItemContent(itemToUpdateId, {
      base64: img.url,
    })
  },
})
