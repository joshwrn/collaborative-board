import React from 'react'
import { Connection } from './Connections'
import { useStore } from '@/state/gen-state'

export const ActiveConnection = () => {
  const state = useStore([
    'windows',
    'activeConnection',
    'hoveredConnection',
    'spaceMousePosition',
    'zoom',
  ])

  const activeWindow = state.windows.find(
    (window) => window.id === state.activeConnection?.from,
  )
  const hoveredWindow = state.windows.find(
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
  const state = useStore(['activeConnection'])
  if (!state.activeConnection) {
    return null
  }
  return <ActiveConnection />
}

export const ActiveConnectionGuard = React.memo(ActiveConnectionGuardInternal)
