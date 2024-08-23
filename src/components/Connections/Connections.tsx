import type { FC } from 'react'
import React from 'react'

import { createLineBetweenWindows } from '@/logic/createLineBetweenWindowSides'
import { useStore } from '@/state/gen-state'
import type { WindowType } from '@/state/windows'

import { Arrow } from './Arrow'

const Connection_Internal = ({
  from,
  to,
  isGenerating,
}: {
  from: WindowType
  to: WindowType
  isGenerating?: boolean
}) => {
  const line = React.useMemo(
    () => createLineBetweenWindows(from, to),
    [from, to],
  )

  if (!line) {
    return null
  }

  return (
    <Arrow
      isGenerating={isGenerating}
      onMouseEnter={() => {
        console.log(`windowFrom`, to)
      }}
      startPoint={line.from}
      endPoint={line.to}
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
    `generatingCanvas`,
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

        const isGenerating = state.generatingCanvas.some(
          (gen) =>
            gen.generatedFromItemId === windowFrom.id &&
            gen.newItemId === windowTo.id,
        )

        return (
          <Connection
            key={connection.id + i}
            from={windowFrom}
            to={windowTo}
            isGenerating={isGenerating}
          />
        )
      })}
    </>
  )
}

export const Connections = React.memo(Connections_Internal)
