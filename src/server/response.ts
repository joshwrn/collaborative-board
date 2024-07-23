import { NextResponse } from 'next/server'

export type ApiResponse<T> = Promise<
  NextResponse<T> | NextResponse<{ error: string }>
>

export function fetchFromApi<B, R>(
  url: string,
  method: 'POST',
): (body: B) => Promise<R>
export function fetchFromApi<P extends Record<string, string>, R>(
  url: string,
  method: 'GET',
): (params?: P) => Promise<R>
export function fetchFromApi<B, R>(url: string, method: 'POST' | 'GET') {
  try {
    if (method === 'GET') {
      const fn = async (params: B) => {
        let res = null
        if (params) {
          const createdParams = new URLSearchParams(params)
          const urlWithParams = `${url}?${createdParams.toString()}`
          res = await fetch(urlWithParams)
        }
        if (!res) {
          res = await fetch(url)
        }
        if (res.status === 404) {
          throw new Error('Route not found - check the url')
        }
        const json = (await res.json()) as R
        return json
      }
      return fn
    }
    if (method === 'POST') {
      const fn = async (body: B) => {
        console.log('body: ', body)
        const res = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(body),
        })
        if (res.status === 404) {
          throw new Error('Route not found - check the url')
        }
        const json = (await res.json()) as R
        return json
      }
      return fn
    }
    throw new Error("Method must be 'GET' or 'POST'")
  } catch (e: any) {
    console.log('fetchFromApi error: ', e)
    return null
  }
}
