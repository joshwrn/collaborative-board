import { nanoid } from 'nanoid'
import { AppStateCreator, produceState } from './state'

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
  createNotification: (notification: Partial<Notification>) => void
}

export const notificationsStore: AppStateCreator<NotificationsStore> = (
  set,
  get,
) => ({
  notifications: [],
  createNotification: (notification) => {
    produceState(set, (draft) => {
      draft.notifications.push({
        type: 'info',
        message: ``,
        id: nanoid(),
        ...notification,
      })
    })
  },
  setNotificationProgress: (id: string, progress: number) => {
    produceState(set, (draft) => {
      const notification = draft.notifications.find((n) => n.id === id)
      if (notification) {
        notification.progress = progress
      }
    })
  },
})
