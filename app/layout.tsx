import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Manga to Anime AI Agent',
  description: 'Transform manga panels into animated sequences using AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 min-h-screen">
        {children}
      </body>
    </html>
  )
}
