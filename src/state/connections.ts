import { AppStateCreator, Setter, stateSetter } from './state'

export const SIDES = ['top', 'right', 'bottom', 'left'] as const
export type Side = (typeof SIDES)[number]

export type Connection = {
  id: string
  from: {
    id: string
  }
  to: {
    id: string
  }
}
export type ActiveConnection = Pick<Connection, 'from'>
export type HoveredConnection = Pick<Connection, 'to'>

export type ConnectedWindowsStore = {
  activeConnection: ActiveConnection | null
  setActiveConnection: Setter<ActiveConnection | null>
  hoveredConnection: HoveredConnection | null
  setHoveredConnection: Setter<HoveredConnection | null>
  connections: Connection[]
  setConnections: Setter<Connection[]>
  makeConnection: (connection: Pick<Connection, 'to'>) => void
  removeConnection: (connectionId: string) => void
}

export const connectedWindowsStore: AppStateCreator<ConnectedWindowsStore> = (
  set,
  get,
) => ({
  activeConnection: null,

  setActiveConnection: (setter) => stateSetter(set, setter, `activeConnection`),

  hoveredConnection: null,

  setHoveredConnection: (setter) =>
    stateSetter(set, setter, `hoveredConnection`),

  makeConnection: (connector) => {
    const activeConnection = get().activeConnection
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
          id: `${activeConnection.from.id}-${connector.to.id}`,
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
      (connection.from.id === from && connection.to.id === to) ||
      (connection.from.id === to && connection.to.id === from),
  )
}
