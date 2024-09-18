import React from 'react'

import { createLineBetweenWindows } from '@/logic/createLineBetweenWindowSides'
import { Connection } from '@/state/connections'
import { useStore } from '@/state/gen-state'
import type { WindowType } from '@/state/windows'
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

const SettingsNodeConnections_Internal: React.FC = () => {
  const state = useStore([
    `falSettingsConnections`,
    `windows`,
    `activeFalConnection`,
    `openContextMenu`,
  ])
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
      {state.activeFalConnection && (
        <ActiveConnection from={state.activeFalConnection} />
      )}
      {state.falSettingsConnections.map((connection) => {
        const windowFrom = windowsMap[connection.from]
        const windowTo = windowsMap[connection.to]
        if (!windowFrom || !windowTo) {
          return null
        }
        const line = createLineBetweenWindows(windowFrom, windowTo)

        if (!line) {
          return null
        }
        return (
          <Line
            onContextMenu={(e) => {
              e.preventDefault()
              state.openContextMenu({
                elementType: `connections`,
                id: connection.id,
              })
            }}
            key={connection.id}
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
      })}
    </>
  )
}

export const SettingsNodeConnections = React.memo(
  SettingsNodeConnections_Internal,
)
