export const API_ROUTES = [`fal/proxy`, `imageUrlToBase64`, `scenario`] as const
export type ApiRouteUrl = (typeof API_ROUTES)[number]
