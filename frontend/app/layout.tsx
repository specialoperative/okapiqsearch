import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Okapiq - Bloomberg for Small Businesses',
  description: 'AI-powered deal sourcing from public data, owner signals, and market intelligence. Get CRM-ready leads with TAM/SAM estimates and ad spend analysis while competitors are still cold calling.',
  keywords: 'SMB deals, market intelligence, TAM SAM SOM, HHI, succession risk, lead generation, M&A, acquisition',
  authors: [{ name: 'Okapiq Team' }],
  creator: 'Okapiq',
  publisher: 'Okapiq',
  robots: 'index, follow',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://app.okapiq.com/',
    title: 'Okapiq - Bloomberg for Small Businesses',
    description: 'AI-powered deal sourcing and market intelligence for SMB acquisitions',
    siteName: 'Okapiq',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Okapiq - Market Intelligence Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Okapiq - Bloomberg for Small Businesses',
    description: 'AI-powered deal sourcing and market intelligence for SMB acquisitions',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#3b82f6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={`${inter.className} h-full bg-gray-50`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 