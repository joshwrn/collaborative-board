import type { FC } from 'react'
import React from 'react'
import { IoIosArrowForward } from 'react-icons/io'

import {
  calculateAngleBetweenPoints,
  createLineBetweenWindows,
} from '@/logic/createLineBetweenWindowSides'
import { createLineFromWindowToMouse } from '@/logic/createLineFromWindowToMouse'
import type { Connection as ConnectionType } from '@/state/connections'
import { useStore } from '@/state/gen-state'
import type { WindowType } from '@/state/windows'
import { joinClasses } from '@/utils/joinClasses'

import styles from './Connections.module.scss'

const ConnectionInternal = ({
  from,
  to,
  id,
  isActive,
  mousePosition,
  hoveredItem,
  zoom,
}: {
  from: WindowType
  to: WindowType | undefined
  mousePosition?: { x: number; y: number }
  id: string
  zoom: number
  isActive?: boolean
  hoveredItem: `from` | `none` | `to`
}) => {
  const state = useStore([`openContextMenu`, `contextMenu`])

  const properties = React.useMemo(
    () =>
      to
        ? createLineBetweenWindows(from, to)
        : createLineFromWindowToMouse(from, mousePosition),
    [from, to, mousePosition],
  )

  const isSelected =
    state.contextMenu?.elementType === `connections` &&
    state.contextMenu.id === id

  if (!properties) return null
  const { line, distance } = properties
  return (
    <div
      // onContextMenu={(e) => {
      //   e.preventDefault()
      //   e.stopPropagation()
      //   state.openContextMenu({
      //     id,
      //     elementType: 'connections',
      //   })
      // }}
      className={joinClasses(
        styles.line,
        createBackgroundClass(!!isActive, isSelected, hoveredItem),
      )}
      style={{
        width: distance.toString() + `px`,
        left: line.from.x,
        top: line.from.y,
        height: `${1 / zoom}px`,
        background: createBackground(isActive, zoom),
        transformOrigin: `0 0`,
        transform: `rotate(${calculateAngleBetweenPoints(
          line.from.x,
          line.from.y,
          line.to.x,
          line.to.y,
        )}deg)
        `,
      }}
    >
      {/* svg causes visual glitches when there are many connections */}
      <IoIosArrowForward size={35} />
    </div>
  )
}

export const Connection = React.memo(ConnectionInternal)

const createBackground = (isActive: boolean | undefined, zoom: number) => {
  if (isActive) {
    return `repeating-linear-gradient(to right,#7c7c7c,#7c7c7c ${
      10 / zoom
    }px,transparent ${10 / zoom}px,transparent ${15 / zoom}px)`
  }
  return undefined
}

const createBackgroundClass = (
  isActive: boolean,
  isSelected: boolean,
  hoveredItem: `from` | `none` | `to`,
) => {
  if (isActive) {
    return styles.active
  }
  if (isSelected) {
    return styles.selected
  }
  if (hoveredItem === `from`) {
    return styles.from
  }
  if (hoveredItem === `to`) {
    return styles.to
  }
  return null
}

export const ConnectionsInternal: FC = () => {
  const state = useStore([
    `connections`,
    `windows`,
    `hoveredItem`,
    `hoveredWindow`,
    `showConnections`,
    `zoom`,
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

        return (
          <Connection
            key={connection.id + i}
            from={windowFrom}
            to={windowTo}
            id={connection.id}
            zoom={state.zoom}
            hoveredItem={includesHoveredItem(
              connection,
              state.hoveredItem ?? state.hoveredWindow,
            )}
          />
        )
      })}
    </>
  )
}

export const Connections = React.memo(ConnectionsInternal)

const includesHoveredItem = (
  connection: ConnectionType,
  hoveredItem: string | null,
) => {
  if (!hoveredItem) return `none`
  if (connection.from === hoveredItem) {
    return `from`
  }
  if (connection.to === hoveredItem) {
    return `to`
  }
  return `none`
}
