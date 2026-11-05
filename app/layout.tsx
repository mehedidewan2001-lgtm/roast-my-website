import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Roast My Website — £9',
  description: 'Your website is probably losing you customers. Find out exactly what\'s broken. Brutal, specific, actionable. £9.',
  openGraph: {
    title: 'Roast My Website — £9',
    description: 'Brutal honest website audit. Find out exactly what\'s losing you customers.',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
