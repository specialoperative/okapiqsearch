import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Okapiq - Bloomberg for Small Businesses',
  description: 'Market intelligence platform for small business acquisitions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body 
        className={inter.className}
        style={{
          background: `
            linear-gradient(135deg, rgba(139, 69, 19, 0.02) 0%, rgba(160, 82, 45, 0.05) 100%),
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 15px,
              rgba(139, 69, 19, 0.01) 15px,
              rgba(139, 69, 19, 0.01) 30px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 15px,
              rgba(160, 82, 45, 0.01) 15px,
              rgba(160, 82, 45, 0.01) 30px
            )
          `
        }}
      >
        {children}
      </body>
    </html>
  )
} 