import { describeImage } from './describeImage'
import { imageToImage } from './imageToImage'

export const convertSketchToImage = async ({
  sketch_url,
  description_prompt,
  style,
}: {
  sketch_url: string
  description_prompt: string
  style: string
}) => {
  const description = await describeImage({
    image_url: sketch_url,
    prompt: description_prompt,
  })
  const image = await imageToImage({
    image_url: sketch_url,
    prompt: `Convert this sketch to a ${style}, using the following description: ${description.output}`,
    num_inference_steps: 64,
    guidance_scale: 20,
    strength: 1,
  })
  return image
}
