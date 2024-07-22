import { open } from 'fs'
import { openai } from '../../openai'
// next js endpoint
import { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'

export const POST = async (req: NextApiRequest) => {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
  }
  console.log('body: ', req.body)

  // @ts-expect-error
  const { image, prompt } = await req.json()

  if (!image || !prompt) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 },
    )
  }
  const descriptionResponse = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'What is this a rough sketch of? Provide as much detail as possible.',
          },
          {
            type: 'image_url',
            image_url: {
              url: `${image}`,
            },
          },
        ],
      },
    ],
    // https://www.headway.io/blog/describe-images-using-openai-and-next-js
    stream: false, // set to true to get the response as a stream of tokens
    max_tokens: 1000,
  })

  const description = descriptionResponse.choices[0].message.content

  console.log('description: ', description)

  if (!description) {
    return NextResponse.json(
      { error: 'Failed to generate description' },
      { status: 400 },
    )
  }

  const imageResponse = await openai.images.generate({
    model: 'dall-e-3',
    prompt: `I need to convert this description of a drawing into a photo matching this style: ${prompt}. Description: ${description}`,
    n: 1,
    size: '1024x1024',
  })

  const generatedImage = imageResponse.data[0].url

  console.log('generatedImage: ', generatedImage)

  return NextResponse.json(
    {
      generatedImage,
    },
    {
      status: 200,
    },
  )
}
