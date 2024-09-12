import React from 'react'

import { CONNECTION_NODE_MARGINS } from '@/state/connections'

import style from './NodeConnector.module.scss'

const NodeConnectorWrapper: React.FC<{
  children: React.ReactNode
  direction: `incoming` | `outgoing`
}> = ({ children, direction }) => {
  let styles: React.CSSProperties = {}
  if (direction === `outgoing`) {
    styles = {
      transform: `translateX(100%)`,
      right: CONNECTION_NODE_MARGINS.side,
      alignItems: `flex-start`,
    }
  }
  if (direction === `incoming`) {
    styles = {
      transform: `translateX(-100%)`,
      left: CONNECTION_NODE_MARGINS.side,
      alignItems: `flex-end`,
    }
  }
  return (
    <div
      className={style.wrapper}
      style={{
        ...styles,
        top: CONNECTION_NODE_MARGINS.top,
      }}
    >
      {children}
    </div>
  )
}

const NodeConnection: React.FC<{
  label: string
  backgroundColor: string
  direction: `incoming` | `outgoing`
}> = ({ label, backgroundColor, direction }) => {
  return (
    <div
      className={style.nodeWrapper}
      style={{
        flexDirection: direction === `outgoing` ? `row-reverse` : `row`,
      }}
    >
      <p className={style.label}>{label}</p>
      <div
        className={style.node}
        style={{
          backgroundColor,
        }}
      />
    </div>
  )
}

export const NodeConnector = {
  Wrapper: NodeConnectorWrapper,
  Connection: NodeConnection,
}
