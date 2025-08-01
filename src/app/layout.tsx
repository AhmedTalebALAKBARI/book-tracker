import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Book Tracker',
  description: 'Track your books and reading habits',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 dark:bg-gray-900 antialiased">
        {}
        <div className="relative min-h-screen">{children}</div>
      </body>
    </html>
  )
}
