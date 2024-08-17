import * as fal from '@fal-ai/serverless-client'

interface DescribeImageResponse {
  output: string
  partial: boolean
}

const mock_image_url = `https://llava-vl.github.io/static/images/monalisa.jpg`
const default_prompt = `what is this an image of? Use as much detail as possible.`

// unused
export const describeImage = async ({
  image_url = mock_image_url,
  prompt,
  max_tokens = 64,
  temperature = 0.2,
  top_p = 1,
}: {
  image_url: string
  prompt?: string
  max_tokens?: number
  temperature?: number
  top_p?: number
}) => {
  const result = await fal.subscribe(`fal-ai/llavav15-13b`, {
    input: {
      image_url,
      prompt: prompt ?? default_prompt,
      max_tokens,
      temperature,
      top_p,
    },
    logs: true,
    onQueueUpdate: (update) => {
      console.log(update)
      if (update.status === `IN_PROGRESS`) {
        if (update.logs) {
          update.logs.map((log) => log.message).forEach(console.log)
        }
      }
    },
  })
  return result
}
