/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'

import { createLineBetweenWindows } from '@/logic/createLineBetweenWindowSides'
import { findConnection } from '@/state/connections'
import { useStore, useZ } from '@/state/gen-state'
import { findWindow } from '@/state/windows'
import { Line } from '@/ui/Connections/Line'
import { CONNECTION_COLORS, NodeConnector } from '@/ui/Connections/NodeConnector'

export const CONNECTION_LABELS = {
  outgoing: {
    falSettingsConnections: `canvases`,
  },
}

export const NodeConnections: React.FC<{ fromId: string }> = ({ fromId }) => {
  const state = useStore([`setState`])
  return (
    <NodeConnector.Wrapper direction="outgoing">
      <NodeConnector.Connector
        label={`canvases`}
        backgroundColor={CONNECTION_COLORS.falSettingsConnections}
        direction="outgoing"
        onClick={() => {
          state.setState((draft) => {
            draft.activeFalConnection =
              draft.activeFalConnection === fromId ? null : fromId
          })
        }}
      />
    </NodeConnector.Wrapper>
  )
}

const ActiveConnection: React.FC<{
  from: string
}> = ({ from }) => {
  const state = useStore([
    `falSettingsConnections`,
    `windows`,
    `spaceMousePosition`,
    `openContextMenu`,
  ])
  const windowFrom = state.windows.find((w) => w.id === from)
  if (!windowFrom) {
    throw new Error(`windowFrom not found - id: ${from}`)
  }
  const line = createLineBetweenWindows(windowFrom, windowFrom)
  return (
    <Line
      isActive={false}
      startPoint={{
        x: line.from.x,
        y: line.from.y + 65,
      }}
      endPoint={{
        x: state.spaceMousePosition.x - 15,
        y: state.spaceMousePosition.y - 20,
      }}
      config={{
        strokeWidth: 2,
        arrowColor: `hsl(248, 100%, 75%)`,
        dotEndingBackground: `hsl(248, 100%, 75%)`,
        dashArray: [5, 6],
      }}
    />
  )
}
const StandardConnection: React.FC<{
  id: string
}> = ({ id }) => {
  const state = useZ([`openContextMenu`], (state) => {
    const connection = findConnection(state.falSettingsConnections, id)
    return {
      connection,
      windowFrom: findWindow(state.windows, connection?.from),
      windowTo: findWindow(state.windows, connection?.to),
    }
  })

  if (
    state.windowFrom.id === 'default-id' ||
    state.windowTo.id === 'default-id'
  ) {
    return null
  }

  const line = createLineBetweenWindows(state.windowFrom, state.windowTo)
  return (
    <Line
      onContextMenu={(e) => {
        e.preventDefault()
        state.openContextMenu({
          elementType: `connections`,
          id: state.connection.id,
        })
      }}
      key={state.connection.id}
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
  const state = useStore([
    `falSettingsConnections`,
    `activeFalConnection`,
    `openContextMenu`,
  ])
  return (
    <>
      {state.activeFalConnection && (
        <ActiveConnection from={state.activeFalConnection} />
      )}
      {state.falSettingsConnections.map((connection) => (
        <StandardConnection key={connection.id} id={connection.id} />
      ))}
      )
    </>
  )
}
