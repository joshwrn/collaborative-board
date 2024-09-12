import React from 'react'

import { createLineBetweenWindows } from '@/logic/createLineBetweenWindowSides'
import { CONNECTION_COLORS } from '@/state/connections'
import { useStore } from '@/state/gen-state'
import type { Item } from '@/state/items'
import type { WindowType } from '@/state/windows'
import { Line } from '@/ui/Connections/Line'
import { NodeConnector } from '@/ui/Connections/NodeConnector'

export const NodeConnections: React.FC<{ item: Item }> = ({ item }) => {
  return (
    <>
      <NodeConnector.Wrapper direction="incoming">
        <NodeConnector.Connection
          label={`settings`}
          backgroundColor={CONNECTION_COLORS.falSettingsConnections}
          direction="incoming"
        />
        {item.body.type === `generated` && (
          <NodeConnector.Connection
            label={`generator`}
            backgroundColor={CONNECTION_COLORS.connections}
            direction="incoming"
          />
        )}
      </NodeConnector.Wrapper>
      <NodeConnector.Wrapper direction="outgoing">
        {item.body.type === `generator` && (
          <NodeConnector.Connection
            label={`generations`}
            backgroundColor={CONNECTION_COLORS.connections}
            direction="outgoing"
          />
        )}
      </NodeConnector.Wrapper>
    </>
  )
}

const ItemConnections_Internal: React.FC = () => {
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

        const line = createLineBetweenWindows(windowFrom, windowTo)

        if (!line) {
          return null
        }

        return (
          <Line
            key={connection.id}
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
      })}
    </>
  )
}

export const ItemConnections = React.memo(ItemConnections_Internal)
