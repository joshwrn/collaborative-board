import { fetchFromApi } from '../response'

export type ImageUrlToBase64Response = {
  base64: string
}

export type ImageUrlToBase64Request = {
  url: string
}

export const fetchImageUrlToBase64 = fetchFromApi<
  ImageUrlToBase64Request,
  ImageUrlToBase64Response
>(`imageUrlToBase64`, `GET`)
