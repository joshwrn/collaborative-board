import * as fal from '@fal-ai/serverless-client'

export const describeImage = async () => {
  const result = await fal.subscribe('fal-ai/llavav15-13b', {
    input: {
      image_url: 'https://llava-vl.github.io/static/images/monalisa.jpg',
      prompt: 'what is this an image of? Use as much detail as possible.',
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
  console.log(result)
  return result
}
