import { nanoid } from 'nanoid'

import { mockProgress } from '@/mock/mock-progress'

import type { AppStateCreator } from './state'
import { produceState } from './state'

export interface Notification {
  type: `error` | `info` | `success`
  message: string
  id: string
  progress: number
  isLoading?: boolean
}

const NOTIFICATION_TIMEOUT = 3000

export interface NotificationsStore {
  notifications: Notification[]
  setNotificationProgress: (id: string, progress: number) => void
  createNotification: (notification: Partial<Notification>) => Notification
  removeNotification: (id: string) => void
  updateNotification: (id: string, update: Partial<Notification>) => void
  successNotification: (message: string) => Promise<void>
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
  createNotification: (notification) => {
    const newNotification = {
      type: `info` as const,
      message: ``,
      id: nanoid(),
      progress: 0,
      ...notification,
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
  successNotification: async (message) => {
    const state = get()
    const newNotification = state.createNotification({
      type: `success`,
      message,
    })
    await mockProgress({
      onProgress: (progress) => {
        state.setNotificationProgress(newNotification.id, 100 - progress)
      },
      time: NOTIFICATION_TIMEOUT,
    })
    state.removeNotification(newNotification.id)
  },
  promiseNotification: async (promise, notificationPartial, options) => {
    const state = get()
    const newNotification = state.createNotification(notificationPartial)
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
