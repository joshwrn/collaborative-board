import * as fal from '@fal-ai/serverless-client'
import { nanoid } from 'nanoid'
import React, { createContext, useState } from 'react'

import type { FalImage } from '../api/fal-general-types'
import type {
  OptimizedLatentConsistencyInput,
  OptimizedLatentConsistencyOutput,
} from '../api/optimizedLatentConsistency'
import { optimizedLatentConsistency } from '../api/optimizedLatentConsistency'

type LiveImageResult = { url: string }
type LiveImageRequest = {
  prompt: string
  image_url: string
  sync_mode: boolean
  strength: number
  seed: number
  enable_safety_checks: boolean
}
type LiveImageContextType =
  | ((req: LiveImageRequest) => Promise<LiveImageResult>)
  | null

export const LiveImageContext = createContext<LiveImageContextType>(null)
export const LiveImageProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [count, setCount] = useState(0)
  const [fetchImage, setFetchImage] = useState<{
    current: LiveImageContextType
  }>({ current: null })

  React.useEffect(() => {
    const requestsById = new Map<
      string,
      {
        resolve: (result: LiveImageResult) => void
        reject: (err: unknown) => void
        timer: ReturnType<typeof setTimeout>
      }
    >()

    const { send, close } = fal.realtime.connect(`110602490-lcm-sd15-i2i`, {
      connectionKey: `fal-realtime-example`,
      clientOnly: false,
      throttleInterval: 0,
      onError: (error) => {
        console.log(`this is the error`, error)
        console.error(error)
        // force re-connect
        setCount((c) => c + 1)
      },
      onResult: (result) => {
        if (result.images?.[0]) {
          const id = result.request_id
          const request = requestsById.get(id)
          if (request) {
            console.log(`this is the result`, result)
            request.resolve(result.images[0])
          }
        }
      },
    })

    setFetchImage({
      current: async (req) => {
        return new Promise((resolve, reject) => {
          const id = nanoid()
          const timer = setTimeout(() => {
            requestsById.delete(id)
            reject(new Error(`Timeout`))
          }, 5000)
          requestsById.set(id, {
            resolve: (res) => {
              resolve(res)
              clearTimeout(timer)
            },
            reject: (err) => {
              reject(err)
              clearTimeout(timer)
            },
            timer,
          })
          send({ ...req, request_id: id })
        })
      },
    })

    return () => {
      for (const request of requestsById.values()) {
        request.reject(new Error(`Connection closed`))
      }
      try {
        close()
      } catch (e) {
        // noop
      }
    }
  }, [count])

  return (
    <LiveImageContext.Provider value={fetchImage.current}>
      {children}
    </LiveImageContext.Provider>
  )
}
