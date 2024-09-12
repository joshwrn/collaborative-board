import { nanoid } from 'nanoid'
import { z } from 'zod'

import type { LiveImageResult } from '@/fal/workflows/useRealtimeConnect'

import type { Connection } from './connections'
import type { AppStateCreator } from './state'

export interface FalStore {
  showFalSettingsModal: boolean
  falSettings: FalSettingsInput
  resetFalSettings: () => void
  updateFalSettings: (settings: Partial<FalSettingsInput>) => void
  generateInitialWindow: (itemId: string) => Promise<void>
  fetchRealtimeImage: (itemId: string) => Promise<void>
  fetchRealtimeImageFn: ((req: FalSettings) => Promise<LiveImageResult>) | null
  falSettingsNodes: FalSettingsNode[]
  updateFalSettingsNode: (
    id: string,
    settings: Partial<FalSettingsInput>,
  ) => void
}

export type FalSettingsNode = FalSettingsInput & { id: string }

export const falSettingsSchema = z.object({
  image_url: z.string().describe(`The image to use as a base.`),
  num_inference_steps: z
    .number()
    .min(1)
    .max(12)
    .describe(
      `The number of inference steps to use for generating the image. The more steps the better the image will be but it will also take longer to generate.`,
    ),
  sync_mode: z
    .boolean()
    .describe(
      `If set to true, the function will wait for the image to be generated and uploaded before returning the response. This will increase the latency of the function but it allows you to get the image directly in the response without going through the CDN.`,
    ),
  guidance_scale: z
    .number()
    .min(0)
    .max(16)
    .describe(
      `The CFG (Classifier Free Guidance) scale is a measure of how close you want the model to stick to your prompt when looking for a related image to show you.`,
    ),
  strength: z.number().min(0).max(1).describe(`The strength of the image.`),
  negative_prompt: z
    .string()
    .describe(
      `The negative prompt to use.Use it to address details that you don't want in the image. This could be colors, objects, scenery and even the small details (e.g. moustache, blurry, low resolution).`,
    )
    .optional(),
  prompt: z
    .string()
    .describe(
      `The prompt to use for generating the image. Be as descriptive as possible for best results.`,
    ),
  seed: z
    .number()
    .describe(
      `The same seed and the same prompt given to the same version of Stable Diffusion will output the same image every time.`,
    ),
  num_images: z
    .number()
    .min(1)
    .max(8)
    .describe(
      `The number of images to generate. The function will return a list of images with the same prompt and negative prompt but different seeds.`,
    )
    .optional(),
  request_id: z
    .string()
    .describe(
      `The id bound to a request, can be used with response to identify the request itself.`,
    )
    .optional(),
  enable_safety_checks: z
    .boolean()
    .describe(
      `If set to true, the resulting image will be checked whether it includes any potentially unsafe content. If it does, it will be replaced with a black image.`,
    ),
})

const falSettingsInputSchema = falSettingsSchema.pick({
  num_inference_steps: true,
  guidance_scale: true,
  strength: true,
})
type FalSettingsInput = z.infer<typeof falSettingsInputSchema>

export type FalSettings = z.infer<typeof falSettingsSchema>

const DEFAULT_FAL_SETTINGS: FalSettingsInput = {
  num_inference_steps: 4,
  guidance_scale: 1,
  strength: 0.8,
}

export const falStore: AppStateCreator<FalStore> = (set, get) => ({
  falSettings: DEFAULT_FAL_SETTINGS,
  showFalSettingsModal: false,

  falSettingsNodes: [
    {
      id: `test-fal-settings-node`,
      ...DEFAULT_FAL_SETTINGS,
    },
  ],
  updateFalSettingsNode: (id, settings) => {
    const state = get()
    state.setState((draft: FalStore) => {
      const node = draft.falSettingsNodes.find((n) => n.id === id)
      if (!node) {
        throw new Error(`node not found - id: ${id}`)
      }
      Object.assign(node, settings)
    })
  },
  updateFalSettings: (settings) => {
    try {
      const parsedSettings = falSettingsInputSchema.partial().parse(settings)
      const state = get()
      state.setState((draft: FalStore) => {
        draft.falSettings = {
          ...draft.falSettings,
          ...parsedSettings,
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
      draft.falSettings = DEFAULT_FAL_SETTINGS
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
    const outgoingConnections = state.itemConnections.filter(
      (connection) => connection.from === item.id,
    )
    state.createItem({
      id: newItemId,
      title: `${item.title} - v${outgoingConnections.length + 2}`,
      body: {
        type: `generated`,
        modifier: `messy watercolor painting`,
        base64: ``,
        activatedAt: new Date().toISOString(),
      },
    })
    const connections = state.itemConnections.filter((c) => c.from === item.id)
    const connectedItems = state
      .findGeneratedItems()
      .filter((i) => connections.map((c) => c.to).includes(i.id))
    connectedItems.forEach((i) => {
      state.editItemContent(i.id, {
        activatedAt: null,
      })
    })
    state.makeConnection(
      {
        to: newItemId,
        from: item.id,
      },
      `itemConnections`,
    )
    state.toggleOpenWindow(newItemId)
    state.moveWindowNextTo(item.id, newItemId)
    await state.fetchRealtimeImage(itemId)
  },

  fetchRealtimeImage: async (itemId) => {
    const state = get()
    if (!state.fetchRealtimeImageFn) {
      return
    }
    const item = state.findGeneratorItems().find((i) => i.id === itemId)
    if (!item) {
      throw new Error(`item id: ${itemId} not found`)
    }
    const { prompt } = item.body
    const { base64 } = item.body
    const connectedIds = state.itemConnections
      .filter((c) => c.from === item.id)
      .map((c) => c.to)
    const itemToUpdate = state
      .findGeneratedItems()
      .find((i) => connectedIds.includes(i.id) && i.body.activatedAt)
    if (!itemToUpdate) {
      console.warn(`itemToUpdate not found`)
      return
    }
    const img = await state.fetchRealtimeImageFn({
      prompt: `a ${itemToUpdate.body.modifier} of ${prompt}`,
      image_url: base64,
      strength: state.falSettings.strength,
      num_inference_steps: state.falSettings.num_inference_steps,
      guidance_scale: state.falSettings.guidance_scale,
      seed: 42,
      enable_safety_checks: false,
      sync_mode: true,
    })
    state.editItemContent(itemToUpdate.id, {
      base64: img.url,
    })
  },
})
