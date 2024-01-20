import { AppStateCreator, Setter, stateSetter } from './state'

export type User = {
  id: string
  name: string
  email: string
  image: string
}

export type UserStore = {
  user: null | User
  setUser: Setter<null | User>
}

export const userStore: AppStateCreator<UserStore> = (set) => ({
  user: null,
  setUser: (setter) => stateSetter(set, setter, `user`),
})
