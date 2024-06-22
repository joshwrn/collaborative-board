import { useAppStore } from '@/state/gen-state'

import type { FC } from 'react'
import { WindowType } from '@/state/windows'
// this arrow caused bad performance... lol?
import { IoIosArrowForward } from 'react-icons/io'
import styles from './Connections.module.scss'
import { joinClasses } from '@/utils/joinClasses'
import {
  LineBetweenWindows,
  calculateAngleBetweenPoints,
  createLineBetweenWindows,
} from '@/logic/createLineBetweenWindowSides'
import { createLineFromWindowToMouse } from '@/logic/createLineFromWindowToMouse'
import { useShallow } from 'zustand/react/shallow'
import { Connection as ConnectionType } from '@/state/connections'
import React from 'react'
import { useStore } from '@/state-signia/store'
import { track } from 'signia-react'

const ConnectionInternal = ({
  id,
  isActive,
  hoveredItem,
  zoom,
  properties,
}: {
  id: string
  zoom: number
  isActive?: boolean
  hoveredItem: 'none' | 'from' | 'to'
  properties: LineBetweenWindows | undefined
}) => {
  // const state = useAppStore(
  //   useShallow((state) => ({
  //     openContextMenu: state.openContextMenu,
  //     contextMenu: state.contextMenu,
  //   })),
  // )

  // this is where the lag is coming from
  // const properties = state.connections.lineBetweenWindows(id)
  const isSelected = false
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
        width: distance.toString() + 'px',
        left: line.from.x,
        top: line.from.y,
        height: `${1 / zoom}px`,
        background: createBackground(isActive, zoom),
        transformOrigin: '0 0',
        transform: `rotate(${calculateAngleBetweenPoints(
          line.from.x,
          line.from.y,
          line.to.x,
          line.to.y,
        )}deg)
        `,
      }}
    />
  )
}

export const Connection = track(ConnectionInternal)

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
  const state2 = useAppStore(
    useShallow((state) => ({
      hoveredItem: state.hoveredItem,
      hoveredWindow: state.hoveredWindow,
      zoom: state.zoom,
    })),
  )
  const state = useStore()

  const allLines = state.connections.allLinesBetweenWindows()

  return (
    <>
      {state.connections.connections.map((connection) => {
        return (
          <Connection
            properties={allLines.find((line) => line?.id === connection.id)}
            key={connection.id}
            id={connection.id}
            zoom={state2.zoom}
            hoveredItem={includesHoveredItem(
              connection,
              state2.hoveredItem ?? state2.hoveredWindow,
            )}
          />
        )
      })}
    </>
  )
}

export const Connections = track(ConnectionsInternal)

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
