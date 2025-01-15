import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolatore Offerte',
  description: 'Calcolatore per il punteggio delle offerte',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
