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
}

export const emailListStore: AppStateCreator<EmailListStore> = (set) => ({
  emails: [
    {
      id: '1',
      from: 'bill gates',
      to: 'SELF',
      address: 'bill.gates@microsoft.com',
      subject: 'New Windows',
      body: "Season's Greetings from Team Microsoft! Tis the season to Excel-sior! 🎄✨ May your holidays be as smooth as a bug-free software update and as delightful as finding a shortcut in a long code. May your days be Merry and your Outlook always bright! Here's to a holiday season filled with more joy than discovering Clippy in the attic. 😉 Wishing you a Windows-wonderful holiday and a PowerPoint-perfect New Year! Happy Holidays, Bill Gates and the Microsoft Crew",
    },
  ],
  setEmails: (setter) => stateSetter(set, setter, `emails`),
})

export type OpenEmailsStore = {
  openEmails: string[]
  toggleOpenEmail: (id: string) => void
}

export const openEmailsStore: AppStateCreator<OpenEmailsStore> = (set, get) => ({
  openEmails: [],
  toggleOpenEmail: (id: string) =>
    set((state) => ({
      openEmails: state.openEmails.includes(id)
        ? state.openEmails.filter((emailId) => emailId !== id)
        : [...state.openEmails, id],
    })),
})
