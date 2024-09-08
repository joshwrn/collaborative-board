import type { Variants } from 'framer-motion'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import React from 'react'
import { BsExclamationCircle as ErrorIcon } from 'react-icons/bs'
import { IoCheckmarkCircleOutline as CheckIcon } from 'react-icons/io5'
import UseAnimations from 'react-useanimations'
import loading from 'react-useanimations/lib/loading'

import { useStore } from '@/state/gen-state'
import type { Notification } from '@/state/notifications'

import style from './Toast.module.scss'

const TOAST_COLORS = {
  error: `#ff3030db`,
  success: `#32ff73db`,
  info: `#0070f3`,
  warning: `#ff9f00db`,
}

export const itemVariants: Variants = {
  initial: {
    right: `-100%`,
  },
  animate: () => ({
    right: 0,
  }),
  exit: () => ({
    right: `-100%`,
  }),
}

const Toast_Internal: React.FC<{ notification: Notification }> = ({
  notification,
}) => {
  let Icon = null
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
  if (notification.type === `error`) {
    Icon = (
      <ErrorIcon
        size={22}
        style={{
          fill: TOAST_COLORS.error,
        }}
      />
    )
  }
  if (notification.type === `warning`) {
    Icon = (
      <ErrorIcon
        size={22}
        style={{
          fill: TOAST_COLORS.warning,
        }}
      />
    )
  }
  if (notification.type === `success`) {
    Icon = (
      <CheckIcon
        size={27}
        style={{
          stroke: TOAST_COLORS.success,
        }}
      />
    )
  }

  return (
    <motion.div
      layout
      layoutId={notification.id}
      className={style.toast}
      variants={itemVariants}
      initial={`initial`}
      animate={`animate`}
      exit={`exit`}
    >
      <div className={style.iconContainer}>{Icon}</div>
      {notification.message}
      <motion.div
        className={style.progress}
        transition={{ type: `spring`, stiffness: 1000, damping: 50 }}
        animate={{
          width: `${notification.progress}%`,
          backgroundColor: TOAST_COLORS[notification.type],
          boxShadow: `0 0 20px ${TOAST_COLORS[notification.type]}`,
        }}
      />
    </motion.div>
  )
}

const Toast = React.memo(Toast_Internal)

export const Toaster: React.FC = () => {
  const state = useStore([`notifications`])
  return (
    <div className={style.wrapper}>
      <LayoutGroup>
        <AnimatePresence>
          {state.notifications.map((notification, index) => {
            return <Toast key={notification.id} notification={notification} />
          })}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  )
}
