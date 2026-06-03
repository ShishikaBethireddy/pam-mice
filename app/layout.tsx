import type { Metadata } from 'next'
import { Poppins, Cormorant_Garamond, Playfair_Display } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
})

const playfair = Playfair_Display({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Nobu Los Cabos — Corporate Retreats',
  description: 'Corporate retreats, offsites, SKOs, and learning programs at Nobu Los Cabos · for design review only',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${cormorant.variable} ${playfair.variable} h-full`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  )
}
