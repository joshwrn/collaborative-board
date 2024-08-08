import { nanoid } from 'nanoid'
import { AppStateCreator, produceState } from './state'
import { mockProgress } from '@/mock/mock-progress'

export type Notification = {
  type: 'success' | 'error' | 'info'
  message: string
  id: string
  progress?: number
  isLoading?: boolean
}

export type NotificationsStore = {
  notifications: Notification[]
  setNotificationProgress: (id: string, progress: number) => void
  createNotification: (notification: Partial<Notification>) => Notification
  removeNotification: (id: string) => void
  updateNotification: (
    id: string,
    update: Partial<Omit<Notification, 'id'>>,
  ) => void
  promiseNotification: (
    promise: () => Promise<any>,
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
      type: 'info' as const,
      message: ``,
      id: nanoid(),
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
  promiseNotification: async (promise, notificationPartial, options) => {
    const state = get()
    const createNotification = state.createNotification
    const newNotification = createNotification(notificationPartial)
    try {
      await promise()
      produceState(set, (draft) => {
        const notification = draft.notifications.find(
          (n) => n.id === newNotification.id,
        )
        if (notification) {
          notification.type = 'success'

          if (options?.onSuccess?.update) {
            Object.assign(notification, options.onSuccess.update)
          }
        }
      })
      options?.onSuccess?.run?.()
      await mockProgress({
        onProgress: (progress) => {
          state.setNotificationProgress(newNotification.id, 100 - progress)
        },
        time: 3000,
      })
      state.removeNotification(newNotification.id)
    } catch (e: any) {
      produceState(set, (draft) => {
        const notification = draft.notifications.find(
          (n) => n.id === newNotification.id,
        )
        if (notification) {
          notification.type = 'error'
          notification.isLoading = false
          notification.message = `${e.message}`
          if (options?.onError?.update) {
            Object.assign(notification, options.onError.update)
          }
        }
      })
      options?.onError?.run?.()
      await mockProgress({
        onProgress: (progress) => {
          state.setNotificationProgress(newNotification.id, 100 - progress)
        },
        time: 3000,
      })
      state.removeNotification(newNotification.id)
    }
  },
})
