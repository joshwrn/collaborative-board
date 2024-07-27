import { fetchFromApi } from '../response'

export type GenerateImageResponse = {
  generatedImage: string
}

export type GenerateImageRequest = {
  base64: string
  prompt: string
}

export const fetchOpenAiGenerateImage = fetchFromApi<
  GenerateImageRequest,
  GenerateImageResponse
>('generateImage', 'POST')
