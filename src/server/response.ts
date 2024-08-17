import type { NextResponse } from 'next/server'

import type { ApiRouteUrl } from './routes'

export type ApiResponse<T> = Promise<
  NextResponse<{ error: string }> | NextResponse<T>
>

export function fetchFromApi<B, R>(
  url: ApiRouteUrl,
  method: `POST`,
): (body: B) => Promise<R>
export function fetchFromApi<P extends Record<string, string>, R>(
  url: ApiRouteUrl,
  method: `GET`,
): (params?: P) => Promise<R>
export function fetchFromApi<B, R>(url: string, method: `GET` | `POST`) {
  try {
    if (method === `GET`) {
      const fn = async (params: B) => {
        let res = null
        if (params) {
          const createdParams = new URLSearchParams(params)
          const urlWithParams = `/api/${url}?${createdParams.toString()}`
          res = await fetch(urlWithParams)
        }
        if (!res) {
          res = await fetch(url)
        }
        if (res.status === 404) {
          throw new Error(`Route not found - check the url`)
        }
        const json = (await res.json()) as R
        return json
      }
      return fn
    }
    if (method === `POST`) {
      const fn = async (body: B) => {
        console.log(`body: `, body)
        const res = await fetch(`/api/${url}`, {
          method: `POST`,
          body: JSON.stringify(body),
        })
        if (res.status === 404) {
          throw new Error(`Route not found - check the url`)
        }
        const json = (await res.json()) as R
        return json
      }
      return fn
    }
    throw new Error(`Method must be 'GET' or 'POST'`)
  } catch (e: any) {
    console.log(`fetchFromApi error: `, e)
    return null
  }
}
