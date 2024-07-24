export const API_ROUTES = ['generateImage', 'imageUrlToBlob'] as const
export type ApiRouteUrl = (typeof API_ROUTES)[number]
