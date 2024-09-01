import * as fal from '@fal-ai/serverless-client'
import type { RealtimeConnection } from '@fal-ai/serverless-client/src/realtime'

import type { FalImage } from './fal-general-types'

export type OptimizedLatentConsistencyInput = {
  image_url: string

  // The prompt to use for generating the image. Be as descriptive as possible for best results. If no prompt is provided, BLIP2 will be used to generate a prompt.
  prompt?: string

  // The strength of the image. Default value: 0.8
  strength?: number

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

  // If set to true, the function will wait for the image to be generated and uploaded before returning the response. This will increase the latency of the function but it allows you to get the image directly in the response without going through the CDN.
  sync_mode?: boolean

  // The number of images to generate. The function will return a list of images with the same prompt and negative prompt but different seeds. Default value: 1
  num_images?: number

  // An id bound to a request, can be used with response to identify the request itself. Default value: ""
  request_id?: string
}

export type OptimizedLatentConsistencyOutput = {
  images: FalImage[]
  timings: any
  seed: number
  request_id: string
  nsfw_content_detected: boolean[]
}

export const optimizedLatentConsistency = ({
  onError,
  onResult,
}: {
  onError: (error: fal.ApiError<any>) => void
  onResult: (result: any) => void
}) => {
  const connection = fal.realtime.connect(`110602490-lcm-sd15-i2i`, {
    connectionKey: `fal-realtime-example`,
    clientOnly: false,
    throttleInterval: 0,
    onError: (error) => {
      onError(error)
    },
    onResult: (result) => {
      onResult(result)
    },
  })

  return connection
}
