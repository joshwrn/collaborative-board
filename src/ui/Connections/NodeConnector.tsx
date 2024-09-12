import React from 'react'

import style from './NodeConnector.module.scss'

export const CONNECTION_NODE_MARGINS = {
  top: `50px`,
  side: `-2px`,
}
export const CONNECTION_TYPES = [
  `falSettingsConnections`,
  `connections`,
] as const
export type ConnectionType = (typeof CONNECTION_TYPES)[number]
export const CONNECTION_COLORS: Record<ConnectionType, string> = {
  falSettingsConnections: `hsl(248, 100%, 75%)`,
  connections: `var(--connection-color)`,
}

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

const Connector: React.FC<{
  label: string
  backgroundColor: string
  direction: `incoming` | `outgoing`
  onClick?: (e: React.MouseEvent) => void
}> = ({ label, backgroundColor, direction, onClick }) => {
  return (
    <div
      className={style.nodeWrapper}
      style={{
        flexDirection: direction === `outgoing` ? `row-reverse` : `row`,
        cursor: onClick ? `pointer` : `default`,
      }}
      onClick={onClick}
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
  Connector: Connector,
}
