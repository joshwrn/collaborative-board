import React from 'react'

import { createLineBetweenWindows } from '@/logic/createLineBetweenWindowSides'
import { findConnection } from '@/state/connections'
import { useZ } from '@/state/gen-state'
import type { Item } from '@/state/items'
import { findWindow } from '@/state/windows'
import { Line } from '@/ui/Connections/Line'
import { CONNECTION_COLORS, NodeConnector } from '@/ui/Connections/NodeConnector'

export const NodeConnections: React.FC<{ item: Item }> = ({ item }) => {
  const state = useZ([`activeFalConnection`, `makeFalSettingsConnection`])
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
              state.makeFalSettingsConnection(state.activeFalConnection, item.id)
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

const StandardConnection: React.FC<{
  id: string
}> = ({ id }) => {
  const state = useZ([`findGeneratedItems`], (state) => {
    const connection = findConnection(state.itemConnections, id)
    return {
      connection,
      windowFrom: findWindow(state.windows, connection?.from),
      windowTo: findWindow(state.windows, connection?.to),
    }
  })

  if (
    state.windowFrom.id === `default-id` ||
    state.windowTo.id === `default-id`
  ) {
    return null
  }

  const isActive = state
    .findGeneratedItems()
    .some((item) => item.id === state.windowTo.id && item.body.activatedAt)

  const line = createLineBetweenWindows(state.windowFrom, state.windowTo)

  if (!line) {
    return null
  }

  return (
    <Line
      key={state.connection.id}
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

const ItemConnections_Internal: React.FC = () => {
  const state = useZ([`itemConnections`, `showConnections`])
  if (!state.showConnections) {
    return null
  }

  return (
    <>
      {state.itemConnections.map((connection, i) => {
        return <StandardConnection key={connection.id} id={connection.id} />
      })}
    </>
  )
}

export const ItemConnections = React.memo(ItemConnections_Internal)
