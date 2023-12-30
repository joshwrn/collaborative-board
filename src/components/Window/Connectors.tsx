import type { FC } from 'react'
import React from 'react'

import styles from './Connectors.module.scss'
import { joinClasses } from '@/utils/joinClasses'
import { SIDES, Side } from '@/state/windows'
import { FaArrowRightLong } from 'react-icons/fa6'
import { useAppStore } from '@/state/state'

export const Connectors: FC<{ id: string }> = ({ id }) => {
  const state = useAppStore((state) => ({
    activeConnection: state.activeConnection,
    setActiveConnection: state.setActiveConnection,
    makeConnection: state.makeConnection,
  }))
  const makeConnection = (side: Side) => {
    if (!state.activeConnection) {
      state.setActiveConnection({ from: { id, side } })
    } else {
      state.makeConnection({ to: { id, side } })
    }
  }
  const showOutlet =
    state.activeConnection && state.activeConnection.from.id !== id
  return (
    <container
      className={styles.container}
      data-role={state.activeConnection ? 'outlets' : 'connectors'}
    >
      {SIDES.map((side) => (
        <div
          key={side}
          className={joinClasses(
            styles[side],
            showOutlet ? styles.outlet : styles.connector,
          )}
          onClick={() => makeConnection(side)}
        >
          {!showOutlet && <FaArrowRightLong />}
        </div>
      ))}
    </container>
  )
}
