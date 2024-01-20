import { AppStateCreator, Setter, stateSetter } from './state'

export type Member = {
  id: string
  name: string
  email: string
  image: string
}

export type MemberStore = {
  members: Member[]
  setMembers: Setter<Member[]>
}

export const memberStore: AppStateCreator<MemberStore> = (set) => ({
  members: [],
  setMembers: (setter) => stateSetter(set, setter, `members`),
})
