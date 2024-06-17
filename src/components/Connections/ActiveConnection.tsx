import { useAppStore } from '@/state/gen-state'
import React from 'react'
import { useShallow } from 'zustand/react/shallow'
import { Connection } from './Connections'

export const ActiveConnection = () => {
  const state = useAppStore(
    useShallow((state) => ({
      openWindows: state.windows,
      activeConnection: state.activeConnection,
      hoveredConnection: state.hoveredConnection,
      spaceMousePosition: state.spaceMousePosition,
      zoom: state.zoom,
    })),
  )
  const activeWindow = state.openWindows.find(
    (window) => window.id === state.activeConnection?.from,
  )
  const hoveredWindow = state.openWindows.find(
    (window) => window.id === state.hoveredConnection?.to,
  )
  if (!activeWindow) {
    return null
  }
  return (
    <Connection
      from={activeWindow}
      zoom={state.zoom}
      to={hoveredWindow}
      id={''}
      mousePosition={state.spaceMousePosition}
      isActive={true}
      hoveredItem={'none'}
    />
  )
}

export const ActiveConnectionGuardInternal = () => {
  const state = useAppStore(
    useShallow((state) => ({
      activeConnection: state.activeConnection,
    })),
  )
  if (!state.activeConnection) {
    return null
  }
  return <ActiveConnection />
}

export const ActiveConnectionGuard = React.memo(ActiveConnectionGuardInternal)
