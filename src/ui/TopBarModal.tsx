import { motion } from 'framer-motion'
import React from 'react'

import style from './TopBarModal.module.scss'
import { joinClasses } from '@/utils/joinClasses'

export const Modal: React.FC<{
  onClose: () => void
  children: React.ReactNode
  modalClassName?: string
}> = ({ children, onClose, modalClassName }) => {
  return (
    <motion.div className={`modalContainer`}>
      <div
        className={`modalBackdrop`}
        style={{
          opacity: 0,
        }}
        onClick={() => onClose()}
      />
      <motion.div
        className={joinClasses(style.modal, modalClassName)}
        initial={{ opacity: 0, y: `-50%` }}
        animate={{
          opacity: 1,
          y: `0%`,
          transition: {
            type: `spring`,
            stiffness: 500,
            damping: 25,
          },
        }}
        exit={{ opacity: 0, y: `calc(-100% - 45px)` }}
        transition={{
          type: `spring`,
          stiffness: 500,
          damping: 50,
        }}
      >
        {children}
      </motion.div>
      <div className={style.blocker} />
    </motion.div>
  )
}

const Content: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return <div className={style.content}>{children}</div>
}

const Button: React.FC<
  {
    onClick?: () => void
    children: React.ReactNode
    className?: string
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ onClick, children, className, ...props }) => {
  return (
    <button
      className={joinClasses(style.button, className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

const Header: React.FC<{
  title: string
  children?: React.ReactNode
}> = ({ title, children }) => {
  return (
    <div className={style.header}>
      <h1>{title}</h1>
      {children}
    </div>
  )
}

const exports = {
  Container: Modal,
  Header,
  Button,
  Content,
}
export default exports
