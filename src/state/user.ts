import { AppStateCreator } from './state'

export type User = {
  id: string
  name: string
  email: string
  image: string
}

export type UserStore = {
  user: null | User
}

export const userStore: AppStateCreator<UserStore> = (set) => ({
  user: null,
})
