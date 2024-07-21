import { open } from 'fs'
import { openai } from '../openai'
// next js endpoint
import { NextApiRequest, NextApiResponse } from 'next'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  console.log(req.body)
  const { image, prompt } = await req.body.json()

  if (!image || !prompt) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Describe this image as if you were David Attenborough. Provide as much detail as possible.',
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${image}`,
            },
          },
        ],
      },
    ],
    // https://www.headway.io/blog/describe-images-using-openai-and-next-js
    stream: false, // set to true to get the response as a stream of tokens
    max_tokens: 1000,
  })

  return res.status(200).json(completion)

  // const { image_buffer, mask_buffer, prompt } = await req.body.json()

  // if (!image_buffer || !mask_buffer || !prompt) {
  //   res.status(400).json({ error: 'Missing required fields' })
  //   return
  // }

  // image_buffer.name = 'image.png'
  // mask_buffer.name = 'mask.png'

  // const response = await openai.images.edit({
  //   model: 'dall-e-2',
  //   image: image_buffer,
  //   mask: mask_buffer,
  //   prompt,
  //   n: 1,
  //   size: '1024x1024',
  // })

  // return res.status(200).json(response.data)
}
