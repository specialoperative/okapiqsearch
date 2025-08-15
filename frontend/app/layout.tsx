import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import dynamic from 'next/dynamic'
const BreadcrumbPath = dynamic(() => import('../components/BreadcrumbPath'), { ssr: false });
const AuthProvider = dynamic(() => import('../components/auth/AuthProvider').then(m=>m.default), { ssr: false });
const LoginMenu = dynamic(() => import('../components/auth/LoginMenu'), { ssr: false });

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
      <body className={inter.className + ' bg-[#fcfbfa]'}>
        <AuthProvider>
        <div className="border-b bg-white/70 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <a href="/" className="font-semibold text-gray-800">Okapiq</a>
              <span className="text-gray-400">/</span>
              <BreadcrumbPath />
            </div>
            <nav className="hidden md:flex items-center gap-6 text-gray-700">
              <a href="/dashboard" className="hover:text-black">Dashboard</a>
              <a href="/solutions" className="hover:text-black">Solutions</a>
              <a href="/oppy" className="hover:text-black">Market Scanner</a>
              <a href="/crm" className="hover:text-black">CRM</a>
              <a href="/case-studies" className="hover:text-black">Case Studies</a>
              <a href="/pricing" className="hover:text-black">Pricing</a>
              <a href="/buy-box" className="hover:text-black">Buy Box</a>
              <span className="inline-block"><LoginMenu /></span>
            </nav>
          </div>
        </div>
        {children}
        </AuthProvider>
      </body>
    </html>
  )
} 
