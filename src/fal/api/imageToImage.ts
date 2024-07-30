import * as fal from '@fal-ai/serverless-client'

type ImageRequest = {
  image_url: string
  prompt: string
  negative_prompt?: string
  image_size?:
    | 'square_hd'
    | 'square'
    | 'portrait_4_3'
    | 'portrait_16_9'
    | 'landscape_4_3'
    | 'landscape_16_9'

  // max_inference_steps = 1 - 65
  num_inference_steps?: number
  // guidance_scale = 0 - 20
  guidance_scale?: number
  // strength = 0.05 - 1
  strength?: number
  // num_images = 1 - 8
  num_images?: number
  loras?: any[]
  embeddings?: any[]
  enable_safety_checker?: boolean
  safety_checker_version?: string
  format?: 'jpeg' | 'png'
}

export type ImageToImageResponse = {
  images: { url: string; content_type: string }[]
  timings: any
  seed: number
  has_nsfw_concepts: boolean[]
  prompt: string
}

export const MOCK_IMAGE_TO_IMAGE_RESPONSE = {
  images: [
    {
      url: 'https://fal-cdn.batuhan-941.workers.dev/files/tiger/IExuP-WICqaIesLZAZPur.jpeg',
      content_type: 'image/png',
    },
  ],
  timings: {},
  seed: 123,
  has_nsfw_concepts: [false],
  prompt:
    'Convert this sketch to a portrait, using the following description: A tiger is standing in a forest.',
}

const mock_image_url =
  'https://fal-cdn.batuhan-941.workers.dev/files/tiger/IExuP-WICqaIesLZAZPur.jpeg'
const mock_prompt =
  'an island near sea, with seagulls, moon shining over the sea, light house, boats int he background, fish flying over the sea'

// unused
export const imageToImage = async ({
  image_url = mock_image_url,
  prompt = mock_prompt,
  negative_prompt = '',
  image_size = 'square',
  num_inference_steps = 25,
  guidance_scale = 7.5,
  strength = 0.95,
  num_images = 1,
  loras = [],
  embeddings = [],
  enable_safety_checker = true,
  safety_checker_version = 'v1',
  format = 'jpeg',
}: ImageRequest) => {
  const result = await fal.subscribe('fal-ai/fast-sdxl/image-to-image', {
    input: {
      image_url,
      prompt,
      negative_prompt,
      image_size,
      num_inference_steps,
      guidance_scale,
      strength,
      num_images,
      loras,
      embeddings,
      enable_safety_checker,
      safety_checker_version,
      format,
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === 'IN_PROGRESS') {
        if (update.logs) {
          update.logs.map((log) => log.message).forEach(console.log)
        }
      }
    },
  })
  return result as ImageToImageResponse
}
