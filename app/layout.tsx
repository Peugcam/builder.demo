import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Builder Hub - Comunidade de Construtores',
  description: 'Plataforma de comunidade para builders. Inspire-se, colabore e construa o futuro.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Sidebar />
        <main className="lg:ml-64 min-h-screen">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
