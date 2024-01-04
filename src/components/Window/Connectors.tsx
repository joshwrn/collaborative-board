import type { FC } from 'react'
import React from 'react'

import styles from './Connectors.module.scss'
import { joinClasses } from '@/utils/joinClasses'
import { FaArrowRightLong } from 'react-icons/fa6'
import { useAppStore } from '@/state/state'
import { IoMdOutlet } from 'react-icons/io'

import { SIDES } from '@/state/connections'

export const Connectors: FC<{ id: string; isBeingDragged: boolean }> = ({
  id,
  isBeingDragged,
}) => {
  const state = useAppStore((state) => ({
    activeConnection: state.activeConnection,
    setActiveConnection: state.setActiveConnection,
    makeConnection: state.makeConnection,
    connections: state.connections,
  }))
  const makeConnection = () => {
    if (!state.activeConnection) {
      state.setActiveConnection({ from: { id } })
    } else {
      state.makeConnection({ to: { id } })
    }
  }
  const hasConnection = state.connections.some(
    (connection) => connection.to.id === id,
  )
  const showOutlet =
    state.activeConnection && state.activeConnection.from.id !== id
  return (
    <container className={styles.container}>
      {SIDES.map((side) => (
        <div
          data-role={
            isBeingDragged || state.activeConnection ? 'outlets' : 'connectors'
          }
          style={{
            opacity: hasConnection ? 1 : 0,
          }}
          key={side}
          className={joinClasses(
            styles[side],
            showOutlet ? styles.outlet : styles.connector,
          )}
          onClick={() => makeConnection()}
        >
          {showOutlet || hasConnection ? <IoMdOutlet /> : <FaArrowRightLong />}
        </div>
      ))}
    </container>
  )
}
