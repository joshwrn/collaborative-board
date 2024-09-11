import React from 'react'

import { createLineBetweenWindows } from '@/logic/createLineBetweenWindowSides'
import { CONNECTION_COLORS, CONNECTION_NODE_MARGINS } from '@/state/connections'
import { useStore } from '@/state/gen-state'
import type { WindowType } from '@/state/windows'

import { Arrow } from '../Connections/Arrow'
import style from './NodeConnections.module.scss'

export const CONNECTION_LABELS = {
  outgoing: {
    falSettingsConnections: `generators`,
  },
}
type ConnectionType = keyof typeof CONNECTION_LABELS.outgoing

const SETTINGS_CONNECTION_TYPES: ConnectionType[] = [`falSettingsConnections`]

export const NodeConnections: React.FC = ({}) => {
  return (
    <>
      <div
        className={style.incomingWrapper}
        style={{
          right: CONNECTION_NODE_MARGINS.side,
          top: CONNECTION_NODE_MARGINS.top,
          transform: `translateX(100%)`,
          // alignItems: `flex-start`,
        }}
      >
        {SETTINGS_CONNECTION_TYPES.map((type) => {
          const color = CONNECTION_COLORS[type]
          return (
            <div
              key={type}
              className={style.nodeWrapper}
              style={{
                flexDirection: `row-reverse`,
              }}
            >
              <p className={style.label}>{CONNECTION_LABELS.outgoing[type]}</p>
              <div
                className={style.node}
                style={{
                  backgroundColor: color,
                }}
              />
            </div>
          )
        })}
      </div>
    </>
  )
}

const SettingsNodeConnection: React.FC<{
  from: WindowType
  to: WindowType
}> = ({ from, to }) => {
  const line = createLineBetweenWindows(from, to)

  if (!line) {
    return null
  }

  return (
    <Arrow
      isActive={false}
      startPoint={{
        x: line.from.x,
        y: line.from.y + 65,
      }}
      endPoint={{
        x: line.to.x,
        y: line.to.y + 65,
      }}
      config={{
        strokeWidth: 2,
        arrowColor: `hsl(248, 100%, 75%)`,
        dotEndingBackground: `hsl(248, 100%, 75%)`,
      }}
    />
  )
}

export const SettingsNodeConnections: React.FC = () => {
  const state = useStore([`falSettingsConnections`, `windows`])
  const windowsMap = React.useMemo(
    () =>
      state.windows.reduce<Record<string, WindowType>>((acc, window) => {
        acc[window.id] = window
        return acc
      }, {}),
    [state.windows],
  )
  return (
    <>
      {state.falSettingsConnections.map((connection) => {
        const windowFrom = windowsMap[connection.from]
        const windowTo = windowsMap[connection.to]
        if (!windowFrom || !windowTo) {
          return null
        }
        return (
          <SettingsNodeConnection
            key={connection.id}
            from={windowFrom}
            to={windowTo}
          />
        )
      })}
    </>
  )
}
