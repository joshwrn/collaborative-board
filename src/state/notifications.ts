import { nanoid } from 'nanoid'

import { mockProgress } from '@/mock/mock-progress'
import type { TimeValue } from '@/utils/time'
import { Time } from '@/utils/time'

import type { AppStateCreator } from './state'
import { produceState } from './state'

export interface Notification {
  type: `error` | `info` | `success` | `warning`
  message: string
  subText?: string
  id: string
  progress: number
  isLoading?: boolean
}

const NOTIFICATION_TIMEOUT = Time.seconds(3)

export interface NotificationsStore {
  notifications: Notification[]
  setNotificationProgress: (id: string, progress: number) => void
  createNotification_internalState: (
    notification: Partial<Notification>,
  ) => Notification
  removeNotification: (id: string) => void
  updateNotification: (id: string, update: Partial<Notification>) => void
  timedNotification: (input: {
    notification: Partial<Notification>
    timeout?: TimeValue
  }) => Promise<void>
  promiseNotification: (
    promise: () => Promise<any> | undefined | void,
    notification: Partial<Notification>,
    options?: {
      onSuccess?: {
        update?: Partial<Notification>
        run?: () => void
      }
      onError?: {
        update?: Partial<Notification>
        run?: () => void
      }
      onFinish?: {
        run?: () => void
      }
    },
  ) => Promise<void>
}

export const notificationsStore: AppStateCreator<NotificationsStore> = (
  set,
  get,
) => ({
  notifications: [],
  createNotification_internalState: (notification) => {
    const state = get()
    const newNotification = {
      type: `info` as const,
      message: ``,
      id: nanoid(),
      progress: 0,
      ...notification,
    }
    if (state.notifications.find((n) => n.id === newNotification.id)) {
      throw new Error(`Notification already exists`)
    }
    produceState(set, (draft) => {
      draft.notifications.push(newNotification)
    })
    return newNotification
  },
  removeNotification: (id) => {
    produceState(set, (draft) => {
      const index = draft.notifications.findIndex((n) => n.id === id)
      if (index !== -1) {
        draft.notifications.splice(index, 1)
      }
    })
  },
  updateNotification: (id, update) => {
    produceState(set, (draft) => {
      const notification = draft.notifications.find((n) => n.id === id)
      if (notification) {
        Object.assign(notification, update)
      }
    })
  },
  setNotificationProgress: (id, progress) => {
    produceState(set, (draft) => {
      const notification = draft.notifications.find((n) => n.id === id)
      if (notification) {
        notification.progress = progress
      }
    })
  },
  timedNotification: async ({
    notification,
    timeout = NOTIFICATION_TIMEOUT,
  }) => {
    const state = get()
    try {
      const newNotification =
        state.createNotification_internalState(notification)
      await mockProgress({
        onProgress: (progress) => {
          state.setNotificationProgress(newNotification.id, 100 - progress)
        },
        time: timeout,
      })
      state.removeNotification(newNotification.id)
    } catch (e) {
      console.warn(e)
      return
    }
  },
  promiseNotification: async (promise, notificationPartial, options) => {
    const state = get()
    const newNotification =
      state.createNotification_internalState(notificationPartial)
    try {
      await promise()
      produceState(set, (draft) => {
        const notification = draft.notifications.find(
          (n) => n.id === newNotification.id,
        )
        if (notification) {
          notification.type = `success`
          notification.progress = 100
          if (options?.onSuccess?.update) {
            Object.assign(notification, options.onSuccess.update)
          }
        }
      })
      options?.onSuccess?.run?.()
      options?.onFinish?.run?.()
      await mockProgress({
        onProgress: (progress) => {
          state.setNotificationProgress(newNotification.id, 100 - progress)
        },
        time: NOTIFICATION_TIMEOUT,
      })
      state.removeNotification(newNotification.id)
    } catch (e: any) {
      produceState(set, (draft) => {
        const notification = draft.notifications.find(
          (n) => n.id === newNotification.id,
        )
        if (notification) {
          notification.type = `error`
          notification.isLoading = false
          notification.message = `${e.message}`
          if (options?.onError?.update) {
            Object.assign(notification, options.onError.update)
          }
        }
      })
      options?.onError?.run?.()
      options?.onFinish?.run?.()
      console.error(`error`, e)
      await mockProgress({
        onProgress: (progress) => {
          state.setNotificationProgress(newNotification.id, 100 - progress)
        },
        time: NOTIFICATION_TIMEOUT,
      })
      state.removeNotification(newNotification.id)
    }
  },
})
