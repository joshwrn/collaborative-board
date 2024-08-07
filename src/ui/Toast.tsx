import React from 'react'
import style from './Toast.module.scss'
import { useStore } from '@/state/gen-state'
import { LayoutGroup, motion } from 'framer-motion'
import { Notification } from '@/state/notifications'
import UseAnimations from 'react-useanimations'
import loading from 'react-useanimations/lib/loading'
import { BsExclamationCircle as ErrorIcon } from 'react-icons/bs'
import { IoCheckmarkCircleOutline as CheckIcon } from 'react-icons/io5'

const TOAST_COLORS = {
  error: '#ff3030db',
  success: '#32ff73db',
  info: '#ffffffa5',
}

const Toast_Internal: React.FC<{ notification: Notification }> = ({
  notification,
}) => {
  let Icon = null
  if (notification.type === 'error') {
    Icon = (
      <ErrorIcon
        size={22}
        style={{
          fill: TOAST_COLORS.error,
        }}
      />
    )
  }
  if (notification.type === 'success') {
    Icon = (
      <CheckIcon
        size={22}
        style={{
          fill: TOAST_COLORS.success,
        }}
      />
    )
  }
  if (notification.isLoading) {
    Icon = (
      <UseAnimations
        animation={loading}
        size={28}
        strokeColor={TOAST_COLORS.info}
        pathCss={style.loading}
      />
    )
  }
  return (
    <motion.div layout layoutId={notification.id} className={style.toast}>
      <div className={style.iconContainer}>{Icon}</div>
      {notification.message}
      {notification.progress && (
        <motion.div
          className={style.progress}
          animate={{ width: `${notification.progress}%` }}
        />
      )}
    </motion.div>
  )
}

const Toast = React.memo(Toast_Internal)

export const Toaster: React.FC = () => {
  const state = useStore(['notifications'])
  return (
    <div className={style.wrapper}>
      <LayoutGroup>
        {state.notifications.map((notification, index) => {
          return <Toast key={notification.id} notification={notification} />
        })}
      </LayoutGroup>
    </div>
  )
}
