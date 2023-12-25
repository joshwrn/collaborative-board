import { AppStateCreator, StateSetter } from './state'

export type UserStore = {
  user: null | {
    name: string
    email: string
    image: string
  }
  setUser: StateSetter<null | {
    name: string
    email: string
    image: string
  }>
}

export const userStore: AppStateCreator<UserStore> = (set) => ({
  user: null,
  setUser: (callback) => {
    set((state) => ({ user: callback(state.user) }))
  },
})
