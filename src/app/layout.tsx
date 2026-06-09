import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'SmileSync | Premium Dental Clinic Management',
  description: 'India\'s most advanced dental clinic management platform. Book appointments, manage patient records, and grow your practice.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col antialiased`}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}
