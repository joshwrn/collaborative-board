export const API_ROUTES = [
  'fal',
  'generateImage',
  'imageUrlToBase64',
] as const
 export type ApiRouteUrl = (typeof API_ROUTES)[number]