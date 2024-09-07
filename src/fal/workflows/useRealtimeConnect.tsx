import * as fal from '@fal-ai/serverless-client'
import { nanoid } from 'nanoid'
import React, { useState } from 'react'

import { useStore } from '@/state/gen-state'

type LiveImageResult = { url: string }

export const useRealtimeConnect = () => {
  const [count, setCount] = useState(0)
  const state = useStore([`setState`])

  React.useEffect(() => {
    // let timeoutTotal = 0
    const requestsById = new Map<
      string,
      {
        resolve: (result: LiveImageResult) => void
        reject: (err: unknown) => void
        timer: ReturnType<typeof setTimeout>
      }
    >()

    const connection = fal.realtime.connect(`110602490-lcm-sd15-i2i`, {
      connectionKey: `fal-realtime-example`,
      clientOnly: true,
      throttleInterval: 1000,
      onError: (error) => {
        console.error(error)
        // force re-connect
        setCount((c) => c + 1)
      },
      onResult: (result) => {
        console.log(`result`, result)
        if (result.images?.[0]) {
          const id = result.request_id
          const request = requestsById.get(id)
          if (request) {
            request.resolve(result.images[0])
          }
        }
      },
    })

    state.setState((draft) => {
      draft.fetchRealtimeImageFn = async (req) => {
        return new Promise((resolve, reject) => {
          const id = nanoid()
          const timer = setTimeout(() => {
            requestsById.delete(id)
            // timeoutTotal++
            // if (timeoutTotal > 3) {
            //   setCount((prev) => prev + 1)
            // }
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
          connection.send({ ...req, request_id: id })
        })
      }
    })

    return () => {
      for (const request of requestsById.values()) {
        request.reject(new Error(`Connection closed`))
      }
      try {
        connection.close()
      } catch (e) {
        // noop
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])
}
