import * as fal from '@fal-ai/serverless-client'

const mock_image_url =
  'https://storage.googleapis.com/falserverless/model_tests/upscale/owl.png'

export type CreativeUpscaleInput = {
  image_url: string

  // The type of model to use for the upscaling. Default is SD_1_5
  modelType?: 'SD_1_5' | 'SDXL'

  // The prompt to use for generating the image. Be as descriptive as possible for best results. If no prompt is provided, BLIP2 will be used to generate a prompt.
  prompt?: string

  // The scale of the output image. The higher the scale, the bigger the output image will be. Default value: 2
  scale?: number

  // How much the output can deviate from the original. Default value: 0.5
  creativity?: number

  // How much detail to add. Default value: 1
  detail?: number

  // How much to preserve the shape of the original image. Default value: 0.25
  shapePreservation?: number

  // The suffix to add to the generated prompt. Not used for a custom prompt. This is useful to add a common ending to all prompts such as 'high quality' etc or embedding tokens. Default value: " high quality, highly detailed, high resolution, sharp"
  promptSuffix?: string

  // The negative prompt to use. Use it to address details that you don't want in the image. This could be colors, objects, scenery and even the small details (e.g. moustache, blurry, low resolution). Default value: "blurry, low resolution, bad, ugly, low quality, pixelated, interpolated, compression artifacts, noisey, grainy"
  negativePrompt?: string

  // The same seed and the same prompt given to the same version of Stable Diffusion will output the same image every time.
  seed?: number

  // The CFG (Classifier Free Guidance) scale is a measure of how close you want the model to stick to your prompt when looking for a related image to show you. Default value: 7.5
  guidanceScale?: number

  // The number of inference steps to use for generating the image. The more steps the better the image will be but it will also take longer to generate. Default value: 20
  numInferenceSteps?: number

  // If set to true, the resulting image will be checked whether it includes any potentially unsafe content. If it does, it will be replaced with a black image. Default value: true
  enableSafetyChecks?: boolean

  // If set to true, the image will not be processed by the CCSR model before being processed by the creativity model.
  skipCcsr?: boolean

  // Allow for large uploads that could take a very long time.
  overrideSizeLimits?: boolean

  // The URL to the base model to use for the upscaling.
  baseModelUrl?: string

  // The URL to the additional LORA model to use for the upscaling. Default is None.
  additionalLoraUrl?: string

  // The scale of the additional LORA model to use for the upscaling. Default value: 1.
  additionalLoraScale?: number

  // The URL to the additional embeddings to use for the upscaling. Default is None.
  additionalEmbeddingUrl?: string
}

export type CreativeUpscaleOutput = {
  image: {
    url: string
    content_type: string
    file_name: string
    file_size: number
    width: number
    height: number
  }
  seed: number
}

export const MOCK_CREATIVE_UPSCALE_RESPONSE = {
  image: {
    url: 'https://fal-cdn.batuhan-941.workers.dev/files/tiger/IExuP-WICqaIesLZAZPur.jpeg',
    content_type: 'image/png',
    file_name: 'IExuP-WICqaIesLZAZPur.jpeg',
    file_size: 1000,
    width: 1000,
    height: 1000,
  },
  seed: 123,
}

export const creativeUpscale = async ({
  image_url = mock_image_url,
  modelType = 'SD_1_5',
  scale = 1,
  promptSuffix = ' high quality, highly detailed, high resolution, sharp',
  negativePrompt = 'blurry, low resolution, bad, ugly, low quality, pixelated, interpolated, compression artifacts, noisey, grainy',
  seed = 42,
  guidanceScale = 7.5,
  numInferenceSteps = 20,
  enableSafetyChecks = true,
  onUpdate,
  ...rest
}: CreativeUpscaleInput & {
  onUpdate: (update: any) => void
}): Promise<CreativeUpscaleOutput> => {
  const result = await fal.subscribe('fal-ai/creative-upscaler', {
    input: {
      image_url,
      ...rest,
    },
    logs: true,
    onQueueUpdate: (update) => {
      console.log('onQueueUpdate', update)
      onUpdate(update)
      if (update.status === 'IN_PROGRESS') {
        if (update.logs) {
          update.logs.map((log) => log.message).forEach(console.log)
        }
      }
    },
  })

  return result as CreativeUpscaleOutput
}
