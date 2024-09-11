import React from 'react'

import { CONNECTION_COLORS, CONNECTION_NODE_MARGINS } from '@/state/connections'
import type { Item } from '@/state/items'

import style from './NodeConnections.module.scss'

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

export const NodeConnections: React.FC<{ item: Item }> = ({ item }) => {
  return (
    <>
      <div
        className={style.incomingWrapper}
        style={{
          left: CONNECTION_NODE_MARGINS.side,
          top: CONNECTION_NODE_MARGINS.top,
          transform: `translateX(-100%)`,
        }}
      >
        <NodeConnection
          label={`settings`}
          backgroundColor={CONNECTION_COLORS.falSettingsConnections}
          direction="incoming"
        />
        {item.body.type === `generated` && (
          <NodeConnection
            label={`generator`}
            backgroundColor={CONNECTION_COLORS.connections}
            direction="incoming"
          />
        )}
      </div>
      <div
        className={style.incomingWrapper}
        style={{
          right: CONNECTION_NODE_MARGINS.side,
          top: CONNECTION_NODE_MARGINS.top,
          transform: `translateX(100%)`,
          alignItems: `flex-start`,
        }}
      >
        {item.body.type === `generator` && (
          <NodeConnection
            label={`generations`}
            backgroundColor={CONNECTION_COLORS.connections}
            direction="outgoing"
          />
        )}
      </div>
    </>
  )
}
