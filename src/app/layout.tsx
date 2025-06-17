import type { Metadata } from 'next'
import { Geist, Geist_Mono, Inter } from 'next/font/google'
import './globals.css'
import { Layer } from '@/_threejs/Layer'

const textFont = Inter({
  weight: '400',
  variable: '--font-inter',
  subsets: ['latin'],
})

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'ThreeJS TSL EffectNode Template',
  description: 'ThreeJS TSL EffectNode Template',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${textFont.className} ${geistMono.variable} antialiased w-full h-full`}>
        <Layer>{children}</Layer>
      </body>
    </html>
  )
}
