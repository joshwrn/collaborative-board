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
  scale?: number // range: 1 - 5

  // How much the output can deviate from the original. Default value: 0.5
  creativity?: number // range: 0 - 1

  // How much detail to add. Default value: 1
  detail?: number // range: 0 - 5

  // How much to preserve the shape of the original image. Default value: 0.25
  shape_preservation?: number // range: 0 - 3

  // The suffix to add to the generated prompt. Not used for a custom prompt. This is useful to add a common ending to all prompts such as 'high quality' etc or embedding tokens. Default value: " high quality, highly detailed, high resolution, sharp"
  prompt_suffix?: string

  // The negative prompt to use. Use it to address details that you don't want in the image. This could be colors, objects, scenery and even the small details (e.g. moustache, blurry, low resolution). Default value: "blurry, low resolution, bad, ugly, low quality, pixelated, interpolated, compression artifacts, noisey, grainy"
  negative_prompt?: string

  // The same seed and the same prompt given to the same version of Stable Diffusion will output the same image every time.
  seed?: number

  // The CFG (Classifier Free Guidance) scale is a measure of how close you want the model to stick to your prompt when looking for a related image to show you. Default value: 7.5
  guidance_scale?: number // range: 0 - 16

  // The number of inference steps to use for generating the image. The more steps the better the image will be but it will also take longer to generate. Default value: 20
  num_inference_steps?: number // range: 1 - 200

  // If set to true, the resulting image will be checked whether it includes any potentially unsafe content. If it does, it will be replaced with a black image. Default value: true
  enable_safety_checks?: boolean

  // If set to true, the image will not be processed by the CCSR model before being processed by the creativity model.
  skip_ccsr?: boolean

  // Allow for large uploads that could take a very long time.
  override_size_limits?: boolean

  // The URL to the base model to use for the upscaling.
  base_model_url?: string

  // The URL to the additional LORA model to use for the upscaling. Default is None.
  additional_lora_url?: string

  // The scale of the additional LORA model to use for the upscaling. Default value: 1.
  additional_lora_scale?: number

  // The URL to the additional embeddings to use for the upscaling. Default is None.
  additional_embedding_url?: string
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
  prompt,
  scale = 2,
  creativity,
  detail = 1.1,
  shape_preservation = 0.25,
  prompt_suffix = ' high quality, highly detailed, high resolution, sharp',
  negative_prompt = 'blurry, low resolution, bad, ugly, low quality, pixelated, interpolated, compression artifacts, noisey, grainy',
  seed,
  guidance_scale = 7.5,
  num_inference_steps = 20,
  enable_safety_checks = true,
  skip_ccsr = false,
  override_size_limits = false,
  base_model_url,
  additional_lora_url,
  additional_lora_scale = 1,
  additional_embedding_url,
  onUpdate,
}: CreativeUpscaleInput & {
  onUpdate: (update: any) => void
}): Promise<CreativeUpscaleOutput> => {
  const result = await fal.subscribe('fal-ai/creative-upscaler', {
    input: {
      image_url,
      modelType,
      prompt,
      scale,
      creativity,
      detail,
      shape_preservation,
      prompt_suffix,
      negative_prompt,
      seed,
      guidance_scale,
      num_inference_steps,
      enable_safety_checks,
      skip_ccsr,
      override_size_limits,
      base_model_url,
      additional_lora_url,
      additional_lora_scale,
      additional_embedding_url,
    },
    logs: true,
    onQueueUpdate: (update) => {
      onUpdate(update)
    },
  })

  return result as CreativeUpscaleOutput
}
