import * as fal from '@fal-ai/serverless-client'
import { nanoid } from 'nanoid'
import React, { useState } from 'react'

import { useFullStore, useStore } from '@/state/gen-state'
import { Time } from '@/utils/time'

export type LiveImageResult = { url: string }

export const useRealtimeConnect = () => {
  const [count, setCount] = useState(0)
  const state = useStore([`setState`])

  const lastTimeout = React.useRef<number>(Date.now())
  const totalTimeouts = React.useRef<number>(0)

  React.useEffect(() => {
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
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        // useFullStore.getState().timedNotification({
        //   notification: {
        //     id: `fal-realtime-error`,
        //     type: `error`,
        //     message: error.message,
        //   },
        //   timeout: Time.seconds(10),
        // })
        // force re-connect
        setCount((c) => c + 1)
      },
      onResult: (result) => {
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
            if (lastTimeout.current - Date.now() < 2000) {
              totalTimeouts.current += 1
            } else {
              totalTimeouts.current = 0
            }
            lastTimeout.current = Date.now()
            if (totalTimeouts.current > 2) {
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              useFullStore.getState().timedNotification({
                notification: {
                  id: `fal-timeout-error`,
                  type: `warning`,
                  message: `Connection timed out.`,
                  subText: `You may need to wait a few minutes for the connection to be established.`,
                },
                timeout: Time.seconds(10),
              })
            }
            reject(new Error(`Timeout`))
          }, 5000)
          requestsById.set(id, {
            resolve: (res) => {
              resolve(res)
              clearTimeout(timer)
            },
            reject: (err) => {
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              useFullStore.getState().timedNotification({
                notification: {
                  id: `fal-realtime-error`,
                  type: `error`,
                  message: `Can't connect to the server`,
                },
                timeout: Time.seconds(10),
              })
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
      } catch (e) {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])
}
