import type { FC } from 'react'
import React from 'react'
import styles from './ConnectorOverlay.module.scss'
import { IoMdOutlet } from 'react-icons/io'
import { IoWarningOutline } from 'react-icons/io5'

import { useAppStore } from '@/state/state'
import { checkIfConnectionExists } from '@/state/connections'
import { useShallow } from 'zustand/react/shallow'

export const ConnectorOverlay: FC<{
  id: string
}> = ({ id }) => {
  const state = useAppStore(
    useShallow((state) => ({
      activeConnection: state.activeConnection,
      setActiveConnection: state.setActiveConnection,
      makeConnection: state.makeConnection,
      connections: state.connections,
      setHoveredConnection: state.setHoveredConnection,
    })),
  )
  if (!state.activeConnection || state.activeConnection.from.id === id)
    return null
  const alreadyConnected = checkIfConnectionExists({
    to: id,
    from: state.activeConnection.from.id,
    connections: state.connections,
  })
  return (
    <overlay
      className={styles.overlay}
      onClick={() => {
        if (!alreadyConnected) {
          state.makeConnection({ to: { id } })
        }
      }}
      onMouseOver={() => state.setHoveredConnection({ to: { id } })}
      onMouseOut={() => state.setHoveredConnection(null)}
    >
      {alreadyConnected && <IoWarningOutline className={styles.warning} />}
      {!alreadyConnected && <IoMdOutlet className={styles.icon} />}
      {alreadyConnected && <p>Already Connected.</p>}
      {!alreadyConnected && <p>Click to Connect.</p>}
    </overlay>
  )
}
