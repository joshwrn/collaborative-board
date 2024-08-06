import type { FC } from 'react'
import React from 'react'
import styles from './ConnectorOverlay.module.scss'
import { IoMdOutlet } from 'react-icons/io'
import { IoWarningOutline } from 'react-icons/io5'

import { useStore } from '@/state/gen-state'
import { checkIfConnectionExists } from '@/state/connections'

export const ConnectorOverlayInternal: FC<{
  id: string
}> = ({ id }) => {
  const state = useStore([
    'activeConnection',
    'makeConnection',
    'connections',
    'setState',
  ])
  if (!state.activeConnection || state.activeConnection.from === id) return null
  const alreadyConnected = checkIfConnectionExists({
    to: id,
    from: state.activeConnection.from,
    connections: state.connections,
  })
  return (
    <overlay
      className={styles.overlay}
      onClick={() => {
        if (!alreadyConnected) {
          state.makeConnection({ to: id })
        }
      }}
      onMouseOver={() => {
        state.setState((draft) => {
          draft.hoveredConnection = { to: id }
        })
      }}
      onMouseOut={() => {
        state.setState((draft) => {
          draft.hoveredConnection = null
        })
      }}
    >
      {alreadyConnected && <IoWarningOutline className={styles.warning} />}
      {!alreadyConnected && <IoMdOutlet className={styles.icon} />}
      {alreadyConnected && <p>Already Connected.</p>}
      {!alreadyConnected && <p>Click to Connect.</p>}
    </overlay>
  )
}

export const ConnectorOverlay = React.memo(ConnectorOverlayInternal)
