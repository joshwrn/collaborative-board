import { z } from 'zod'

import type { AppStateCreator, Setter } from './state'
import { stateSetter } from './state'

export const connectionSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
})

export type Connection = z.infer<typeof connectionSchema>

export interface ConnectedWindowsStore {
  itemConnections: Connection[]
  falSettingsConnections: Connection[]
  makeConnection: (
    connection: Omit<Connection, `id`>,
    type: `falSettingsConnections` | `itemConnections`,
  ) => void
  removeConnection: (
    connectionId: string,
    type: `falSettingsConnections` | `itemConnections`,
  ) => void
  removeManyConnections: (
    entityId: string,
    type: `falSettingsConnections` | `itemConnections`,
  ) => void
  showConnections: boolean
  setShowConnections: Setter<boolean>
  activeFalConnection: string | null
}

export const connectedWindowsStore: AppStateCreator<ConnectedWindowsStore> = (
  set,
  get,
) => ({
  showConnections: true,
  setShowConnections: (setter) => stateSetter(set, setter, `showConnections`),
  activeFalConnection: null,
  falSettingsConnections: [],

  makeConnection: (connector, type) => {
    const state = get()
    if (
      state[type].some((c) => c.from === connector.from && c.to === connector.to)
    ) {
      return
    }
    state.setState((draft) => {
      draft[type] = [
        ...draft[type],
        {
          from: connector.from,
          to: connector.to,
          id: `${connector.from}/${connector.to}`,
        },
      ]
    })
  },

  itemConnections: [],
  removeManyConnections: (entityId, type) => {
    const state = get()
    state.setState((draft) => {
      draft[type] = draft[type].filter(
        (connection) => !connection.id.includes(entityId),
      )
    })
  },
  removeConnection: (connectionId, type) => {
    const state = get()
    state.setState((draft) => {
      draft[type] = draft[type].filter(
        (connection) => connection.id !== connectionId,
      )
    })
  },
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
