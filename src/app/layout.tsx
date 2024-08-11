import type { Metadata } from 'next'
import './globals.scss'

export const metadata: Metadata = {
  title: 'Board',
  description: 'Generate images with AI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
