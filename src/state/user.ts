import type { AppStateCreator } from './state'

export interface User {
  id: string
  name: string
  email: string
  image: string
}

export interface UserStore {
  user: User | null
}

export const userStore: AppStateCreator<UserStore> = (set) => ({
  user: null,
})
