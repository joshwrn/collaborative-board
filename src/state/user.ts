import { AppStateCreator, Setter, stateSetter } from './state'

export type UserStore = {
  user: null | {
    name: string
    email: string
    image: string
  }
  setUser: Setter<null | {
    name: string
    email: string
    image: string
  }>
}

export const userStore: AppStateCreator<UserStore> = (set) => ({
  user: null,
  setUser: (setter) => stateSetter(set, setter, `user`),
})
