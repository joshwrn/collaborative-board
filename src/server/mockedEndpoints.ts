import { ApiRouteUrl } from './routes'

export const mockedEndpoints: Record<ApiRouteUrl, { [key: string]: boolean }> = {
  generateImage: {
    post: false,
  },
  imageUrlToBlob: {
    get: false,
  },
}
