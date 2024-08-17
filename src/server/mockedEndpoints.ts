import type { ApiRouteUrl } from './routes'

export const mockedEndpoints: Record<ApiRouteUrl, Record<string, boolean>> = {
  imageUrlToBase64: {
    get: false,
  },
  [`fal/proxy`]: {
    post: false,
    get: false,
  },
}
