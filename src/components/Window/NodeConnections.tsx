import React from 'react'

import { createLineBetweenWindows } from '@/logic/createLineBetweenWindowSides'
import { useStore } from '@/state/gen-state'
import type { Item } from '@/state/items'
import type { WindowType } from '@/state/windows'
import { Line } from '@/ui/Connections/Line'
import { CONNECTION_COLORS, NodeConnector } from '@/ui/Connections/NodeConnector'

export const NodeConnections: React.FC<{ item: Item }> = ({ item }) => {
  const state = useStore([`activeFalConnection`, `setState`, `makeConnection`])
  return (
    <>
      <NodeConnector.Wrapper direction="incoming">
        <NodeConnector.Connector
          label={`settings`}
          backgroundColor={CONNECTION_COLORS.falSettingsConnections}
          direction="incoming"
          wrapperStyle={{
            cursor: state.activeFalConnection ? `pointer` : `default`,
          }}
          onClick={() => {
            if (state.activeFalConnection) {
              state.makeConnection(
                {
                  to: item.id,
                  from: state.activeFalConnection,
                },
                `falSettingsConnections`,
              )
              state.setState((draft) => {
                draft.activeFalConnection = null
              })
            }
          }}
        />
        {item.body.type === `generated` && (
          <NodeConnector.Connector
            label={`generator`}
            backgroundColor={CONNECTION_COLORS.connections}
            direction="incoming"
          />
        )}
      </NodeConnector.Wrapper>
      <NodeConnector.Wrapper direction="outgoing">
        {item.body.type === `generator` && (
          <NodeConnector.Connector
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
    `itemConnections`,
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
      {state.itemConnections.map((connection, i) => {
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
