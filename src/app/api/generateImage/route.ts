import { openai } from '../../openai'
import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse } from '@/server/response'
import {
  GenerateImageRequest,
  GenerateImageResponse,
} from '@/server/create/fetchGenerateImage'
import { mockedEndpoints } from '@/server/mockedEndpoints'
import { MOCK_GENERATED_IMAGE } from '@/mock/mockGeneratedImage'

export const POST = async (
  req: NextRequest,
  res: NextResponse,
): ApiResponse<GenerateImageResponse> => {
  if (
    process.env.USE_MOCK_ENDPOINTS === 'true' ||
    mockedEndpoints.generateImage.post
  ) {
    return NextResponse.json(
      {
        generatedImage: MOCK_GENERATED_IMAGE,
      },
      { status: 200 },
    )
  }

  const { base64, prompt } = (await req.json()) as GenerateImageRequest

  console.log('body: ', req.body)

  if (!base64 || !prompt) {
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
              url: `${base64}`,
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

  if (!generatedImage) {
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 400 },
    )
  }

  return NextResponse.json(
    {
      generatedImage: generatedImage as string,
    },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}
