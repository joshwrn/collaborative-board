import { createLineBetweenWindows } from '@/logic/createLineBetweenWindowSides'
import { atom, computed, transact } from 'signia'
import { WindowsStore } from './windows'

export const SIDES = ['top', 'right', 'bottom', 'left'] as const
export type Side = (typeof SIDES)[number]

export type Connection = {
  id: string
  from: string
  to: string
}
export type ActiveConnection = Pick<Connection, 'from'>
export type HoveredConnection = Pick<Connection, 'to'>

export class ConnectionsStore {
  private readonly windowsStore: WindowsStore

  constructor(props: { windowsStore: WindowsStore }) {
    this.windowsStore = props.windowsStore
  }

  private readonly connectionsState = atom<Connection[]>('Store.connections', [])

  @computed get connections() {
    return this.connectionsState.value
  }

  findOne(id: string) {
    return this.connectionsState.value.find((connection) => connection.id === id)
  }

  lineBetweenWindows(id: string) {
    const connection = this.findOne(id)
    if (!connection) {
      return
    }
    const fromWindow = this.windowsStore.findOne(connection.from)
    const toWindow = this.windowsStore.findOne(connection.to)
    if (!fromWindow || !toWindow) {
      return
    }
    return createLineBetweenWindows(fromWindow, toWindow, connection.id)
  }

  @computed get allLinesBetweenWindows() {
    console.log('allLinesBetweenWindows')
    return this.connectionsState.value.map((connection) =>
      this.lineBetweenWindows(connection.id),
    )
  }

  addConnection = (connection: Connection) => {
    this.connectionsState.update((connections) => [...connections, connection])
  }

  removeConnection = (connectionId: string) => {
    this.connectionsState.update((connections) =>
      connections.filter((connection) => connection.id !== connectionId),
    )
  }

  setConnections = (connections: Connection[]) => {
    this.connectionsState.update(() => connections)
  }
}
