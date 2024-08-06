import { AppStateCreator } from './state'

export type Member = {
  id: string
  name: string
  email: string
  image: string
}

export type MemberStore = {
  members: Member[]
}

export const memberStore: AppStateCreator<MemberStore> = (set) => ({
  members: [],
})
