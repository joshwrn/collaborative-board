import type { FC } from 'react'
import React from 'react'

import { createLineBetweenWindows } from '@/logic/createLineBetweenWindowSides'
import { useStore } from '@/state/gen-state'
import type { WindowType } from '@/state/windows'

import { Arrow } from './Arrow'

const Connection_Internal = ({
  from,
  to,
  isActive,
}: {
  from: WindowType
  to: WindowType
  isActive?: boolean
}) => {
  const line = createLineBetweenWindows(from, to)

  if (!line) {
    return null
  }

  return (
    <Arrow
      isActive={isActive}
      startPoint={{
        x: line.from.x,
        y: line.from.y + 65,
      }}
      endPoint={{
        x: line.to.x,
        y: line.to.y + 65 + 40,
      }}
      config={{
        strokeWidth: 2,
        arrowColor: `var(--connection-color)`,
        dotEndingBackground: `var(--connection-color)`,
      }}
    />
  )
}

export const Connection = React.memo(Connection_Internal)

export const Connections_Internal: FC = () => {
  const state = useStore([
    `connections`,
    `windows`,
    `showConnections`,
    `items`,
    `findGeneratedItems`,
  ])
  const windowsMap = React.useMemo(
    () =>
      state.windows.reduce<Record<string, WindowType>>((acc, window) => {
        acc[window.id] = window
        return acc
      }, {}),
    [state.windows],
  )
  if (!state.showConnections) {
    return null
  }

  return (
    <>
      {state.connections.map((connection, i) => {
        const windowFrom = windowsMap[connection.from]
        const windowTo = windowsMap[connection.to]

        if (!windowFrom || !windowTo) {
          return null
        }

        const isActive = state
          .findGeneratedItems()
          .some((item) => item.id === windowTo.id && item.body.activatedAt)

        return (
          <Connection
            key={connection.id + i}
            from={windowFrom}
            to={windowTo}
            isActive={!!isActive}
          />
        )
      })}
    </>
  )
}

export const Connections = React.memo(Connections_Internal)
