import { ApiRouteUrl } from './routes'

export const mockedEndpoints: Record<ApiRouteUrl, { [key: string]: boolean }> = {
  imageUrlToBase64: {
    get: false,
  },
  ['fal/proxy']: {
    post: false,
    get: false,
  },
}
