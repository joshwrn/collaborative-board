import { useAppStore } from '@/state/gen-state'

import type { FC } from 'react'
import { Window } from '@/state/windows'
// this arrow caused bad performance... lol?
import { IoIosArrowForward } from 'react-icons/io'
import styles from './Connections.module.scss'
import { joinClasses } from '@/utils/joinClasses'
import {
  calculateAngleBetweenPoints,
  createLineBetweenWindows,
} from '@/logic/createLineBetweenWindowSides'
import { createLineFromWindowToMouse } from '@/logic/createLineFromWindowToMouse'
import { useShallow } from 'zustand/react/shallow'
import { Connection as ConnectionType } from '@/state/connections'
import React from 'react'

const ConnectionInternal = ({
  from,
  to,
  id,
  isActive,
  mousePosition,
  hoveredItem,
}: {
  from: Window
  to: Window | undefined
  mousePosition?: { x: number; y: number }
  id: string
  isActive?: boolean
  hoveredItem: 'none' | 'from' | 'to'
}) => {
  const state = useAppStore(
    useShallow((state) => ({
      openContextMenu: state.openContextMenu,
      contextMenu: state.contextMenu,
    })),
  )

  const properties = to
    ? createLineBetweenWindows(from, to)
    : createLineFromWindowToMouse(from, mousePosition)
  const isSelected = state.contextMenu?.id === id
  if (!properties) return null
  const { dimensions, line, distance } = properties
  return (
    <div
      className={styles.wrapper}
      style={{
        width: dimensions.width,
        left: dimensions.left,
        top: dimensions.top,
        height: dimensions.height,
      }}
    >
      <div
        onContextMenu={(e) => {
          e.preventDefault()
          e.stopPropagation()
          state.openContextMenu({
            id,
            elementType: 'connections',
          })
        }}
        className={joinClasses(
          styles.line,
          createBackground(!!isActive, isSelected, hoveredItem),
        )}
        style={{
          width: distance.toString() + 'px',
          transform: `rotate(${calculateAngleBetweenPoints(
            line.from.x,
            line.from.y,
            line.to.x,
            line.to.y,
          )}deg)`,
        }}
      >
        {/* <p>arrow</p> */}
      </div>
    </div>
  )
}

const Connection = React.memo(ConnectionInternal)

const createBackground = (
  isActive: boolean,
  isSelected: boolean,
  hoveredItem: 'none' | 'from' | 'to',
) => {
  if (isActive) {
    return styles.active
  }
  if (isSelected) {
    return styles.selected
  }
  if (hoveredItem === 'from') {
    return styles.from
  }
  if (hoveredItem === 'to') {
    return styles.to
  }
  return null
}

export const ConnectionsInternal: FC = () => {
  const state = useAppStore(
    useShallow((state) => ({
      connections: state.connections,
      openWindows: state.windows,
      activeConnection: state.activeConnection,
      hoveredConnection: state.hoveredConnection,
      spaceMousePosition: state.spaceMousePosition,
      hoveredItem: state.hoveredItem,
      hoveredWindow: state.hoveredWindow,
    })),
  )
  const activeWindow = state.openWindows.find(
    (window) => window.id === state.activeConnection?.from,
  )
  const hoveredWindow = state.openWindows.find(
    (window) => window.id === state.hoveredConnection?.to,
  )
  return (
    <>
      {activeWindow && (
        <Connection
          from={activeWindow}
          to={hoveredWindow}
          id={''}
          mousePosition={state.spaceMousePosition}
          isActive={true}
          hoveredItem={'none'}
        />
      )}
      {state.connections.map((connection) => {
        const windowFrom = state.openWindows.find(
          (window) => window.id === connection.from,
        )
        const windowTo = state.openWindows.find(
          (window) => window.id === connection.to,
        )

        if (!windowFrom || !windowTo) {
          return null
        }

        return (
          <Connection
            key={connection.id}
            from={windowFrom}
            to={windowTo}
            id={connection.id}
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
  if (!hoveredItem) return 'none'
  if (connection.from === hoveredItem) {
    return 'from'
  }
  if (connection.to === hoveredItem) {
    return 'to'
  }
  return 'none'
}
