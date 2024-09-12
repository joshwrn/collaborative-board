import React from 'react'

import { createLineBetweenWindows } from '@/logic/createLineBetweenWindowSides'
import { CONNECTION_COLORS } from '@/state/connections'
import { useStore } from '@/state/gen-state'
import type { WindowType } from '@/state/windows'
import { Line } from '@/ui/Connections/Line'
import { NodeConnector } from '@/ui/Connections/NodeConnector'

export const CONNECTION_LABELS = {
  outgoing: {
    falSettingsConnections: `canvases`,
  },
}

export const NodeConnections: React.FC = ({}) => {
  return (
    <NodeConnector.Wrapper direction="outgoing">
      <NodeConnector.Connection
        label={`canvases`}
        backgroundColor={CONNECTION_COLORS.falSettingsConnections}
        direction="outgoing"
      />
    </NodeConnector.Wrapper>
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
        const line = createLineBetweenWindows(windowFrom, windowTo)

        if (!line) {
          return null
        }
        return (
          <Line
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
