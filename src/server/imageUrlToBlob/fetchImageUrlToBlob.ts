import { fetchFromApi } from '../response'

export type ImageUrlToBlobResponse = {
  base64: string
}

export type ImageUrlToBlobRequest = {
  url: string
}

export const fetchImageUrlToBlob = fetchFromApi<
  ImageUrlToBlobRequest,
  ImageUrlToBlobResponse
>('imageUrlToBlob', 'GET')
