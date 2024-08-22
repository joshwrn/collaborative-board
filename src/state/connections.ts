import { z } from 'zod'

import type { AppStateCreator, Setter } from './state'
import { stateSetter } from './state'

export const SIDES = [`top`, `right`, `bottom`, `left`] as const
export type Side = (typeof SIDES)[number]

export const connectionSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
})

export type Connection = z.infer<typeof connectionSchema>

export type ActiveConnection = Pick<Connection, `from`>
export type HoveredConnection = Pick<Connection, `to`>

export interface ConnectedWindowsStore {
  activeConnection: ActiveConnection | null
  hoveredConnection: HoveredConnection | null
  connections: Connection[]
  setConnections: Setter<Connection[]>
  makeConnection: (connection: { to: string; from?: string }) => void
  removeConnection: (connectionId: string) => void
  showConnections: boolean
  setShowConnections: Setter<boolean>
}

export const connectedWindowsStore: AppStateCreator<ConnectedWindowsStore> = (
  set,
  get,
) => ({
  activeConnection: null,

  hoveredConnection: null,

  showConnections: true,
  setShowConnections: (setter) => stateSetter(set, setter, `showConnections`),

  makeConnection: (connector) => {
    const activeConnection = connector.from
      ? {
          from: connector.from,
        }
      : get().activeConnection
    if (!activeConnection) {
      throw new Error(`no active connection`)
    }
    set((state) => ({
      activeConnection: null,
      hoveredConnection: null,
      connections: [
        ...state.connections,
        {
          from: activeConnection.from,
          to: connector.to,
          id: `${activeConnection.from}/${connector.to}`,
        },
      ],
    }))
  },

  connections: [],

  removeConnection: (connectionId) => {
    set((state) => ({
      connections: state.connections.filter(
        (connection) => connection.id !== connectionId,
      ),
    }))
  },

  setConnections: (setter) => stateSetter(set, setter, `connections`),
})

export const checkIfConnectionExists = ({
  to,
  from,
  connections,
}: {
  to: string
  from: string
  connections: Connection[]
}) => {
  return connections.some(
    (connection) =>
      (connection.from === from && connection.to === to) ||
      (connection.from === to && connection.to === from),
  )
}
