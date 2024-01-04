import { SPACE_ATTRS } from './space'
import { AppStateCreator, Setter, stateSetter } from './state'

export const SIDES = ['top', 'right', 'bottom', 'left'] as const
export type Side = (typeof SIDES)[number]

export type Connection = {
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
      connections: [
        ...state.connections,
        {
          from: activeConnection.from,
          to: connector.to,
        },
      ],
    }))
  },
  connections: [],
  setConnections: (setter) => stateSetter(set, setter, `connections`),
})
