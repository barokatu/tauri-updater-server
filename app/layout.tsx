import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tauri Updater Server',
  description: 'Manage Tauri app updates',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
