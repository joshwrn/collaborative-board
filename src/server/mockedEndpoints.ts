import { ApiRouteUrl } from './routes'

export const mockedEndpoints: Record<ApiRouteUrl, { [key: string]: boolean }> = {
  generateImage: {
    post: false,
  },
  imageUrlToBase64: {
    get: false,
  },
}
