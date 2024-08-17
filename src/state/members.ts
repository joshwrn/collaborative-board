import type { AppStateCreator } from './state'

export interface Member {
  id: string
  name: string
  email: string
  image: string
}

export interface MemberStore {
  members: Member[]
}

export const memberStore: AppStateCreator<MemberStore> = (set) => ({
  members: [],
})
