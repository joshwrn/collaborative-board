import { z } from 'zod'

import type { AppStateCreator, Setter } from './state'
import { stateSetter } from './state'

export const connectionSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
})

export type Connection = z.infer<typeof connectionSchema>

export const CONNECTION_TYPES = [
  `falSettingsConnections`,
  `connections`,
] as const
export type ConnectionType = (typeof CONNECTION_TYPES)[number]

export const CONNECTION_COLORS: Record<ConnectionType, string> = {
  falSettingsConnections: `hsl(248, 100%, 75%)`,
  connections: `var(--connection-color)`,
}

export const CONNECTION_MARGINS = {
  from: 5,
  to: 5,
}

export const CONNECTION_NODE_MARGINS = {
  top: `50px`,
  side: `-2px`,
}

export interface ConnectedWindowsStore {
  connections: Connection[]
  falSettingsConnections: Connection[]
  makeConnection: (
    connection: Omit<Connection, `id`>,
    type: `connections` | `falSettingsConnections`,
  ) => void
  removeConnection: (
    connectionId: string,
    type: `connections` | `falSettingsConnections`,
  ) => void
  showConnections: boolean
  setShowConnections: Setter<boolean>
}

export const connectedWindowsStore: AppStateCreator<ConnectedWindowsStore> = (
  set,
  get,
) => ({
  showConnections: true,
  setShowConnections: (setter) => stateSetter(set, setter, `showConnections`),

  falSettingsConnections: [
    {
      id: `test-fal-settings-node/initial-window`,
      from: `test-fal-settings-node`,
      to: `initial-window`,
    },
  ],

  makeConnection: (connector, type) => {
    const state = get()
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

  connections: [],

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
