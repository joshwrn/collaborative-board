import { SPACE_ATTRS } from './space'
import { AppStateCreator, Setter, stateSetter } from './state'

export type OpenWindowsStore = {
  openEmails: string[]
  toggleOpenEmail: (id: string) => void
  windowPositions: { id: string; x: number; y: number }[]
  setWindowPositions: Setter<{ id: string; x: number; y: number }[]>
  setOneWindowPosition: (id: string, position: { x: number; y: number }) => void
  windowSizes: { id: string; width: number; height: number }[]
  setWindowSizes: Setter<{ id: string; width: number; height: number }[]>
  setOneWindowSize: (id: string, size: { width: number; height: number }) => void
}

export const openWindowsStore: AppStateCreator<OpenWindowsStore> = (
  set,
  get,
) => ({
  openEmails: [],
  toggleOpenEmail: (id: string) => {
    set((state) => ({
      openEmails: state.openEmails.includes(id)
        ? state.openEmails.filter((emailId) => emailId !== id)
        : [...state.openEmails, id],
    }))
    set((state) => ({
      windowPositions: state.windowPositions.some(
        (windowPosition) => windowPosition.id === id,
      )
        ? state.windowPositions
        : [
            ...state.windowPositions,
            {
              id,
              x: SPACE_ATTRS.size / 2 - 350,
              y: SPACE_ATTRS.size / 2 - 250,
            },
          ],
    }))
    set((state) => ({
      windowSizes: state.windowSizes.some((windowSize) => windowSize.id === id)
        ? state.windowSizes
        : [
            ...state.windowSizes,
            {
              id,
              width: 700,
              height: 500,
            },
          ],
    }))
  },

  windowPositions: [],
  setWindowPositions: (setter) => stateSetter(set, setter, `windowPositions`),
  setOneWindowPosition: (id, position) => {
    set((state) => ({
      windowPositions: state.windowPositions.map((windowPosition) =>
        windowPosition.id === id
          ? { ...windowPosition, ...position }
          : windowPosition,
      ),
    }))
  },

  windowSizes: [],
  setWindowSizes: (setter) => stateSetter(set, setter, `windowSizes`),
  setOneWindowSize: (id, size) => {
    set((state) => ({
      windowSizes: state.windowSizes.map((windowSize) =>
        windowSize.id === id
          ? {
              ...windowSize,
              ...{
                width: size.width < 300 ? 300 : size.width,
                height: size.height < 300 ? 300 : size.height,
              },
            }
          : windowSize,
      ),
    }))
  },
})

export type ConnectedWindowsStore = {
  connections: { from: string; to: string }[]
  setConnections: Setter<{ from: string; to: string }[]>
}

export const connectedWindowsStore: AppStateCreator<ConnectedWindowsStore> = (
  set,
  get,
) => ({
  connections: [],
  setConnections: (setter) => stateSetter(set, setter, `connections`),
})
