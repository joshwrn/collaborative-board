import { MOCK_EMAILS } from '@/mock/mock-emails'
import { AppStateCreator, Setter, stateSetter } from './state'

export type Email = {
  id: string
  from: string
  to: string
  address: string
  subject: string
  body: string
}

export type EmailListStore = {
  emails: Email[]
  setEmails: Setter<Email[]>
  deleteEmail: (id: string) => void

  hoveredItem: string | null
  setHoveredItem: Setter<string | null>
}

export const emailListStore: AppStateCreator<EmailListStore> = (set) => ({
  emails: MOCK_EMAILS,
  setEmails: (setter) => stateSetter(set, setter, `emails`),
  deleteEmail: (id) =>
    set((state) => ({
      emails: state.emails.filter((email) => email.id !== id),
      connections: state.connections.filter(
        (connection) => connection.id.includes(id) === false,
      ),
    })),

  hoveredItem: null,
  setHoveredItem: (setter) => stateSetter(set, setter, `hoveredItem`),
})
