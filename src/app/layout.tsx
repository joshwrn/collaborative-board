import '../styles/globals.scss'

import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Board`,
  description: `Generate images with AI`,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className}>
      <head>
        <meta name="color-scheme" content="dark light" />
      </head>
      <body>{children}</body>
    </html>
  )
}
