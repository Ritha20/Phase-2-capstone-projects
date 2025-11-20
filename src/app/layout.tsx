// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/lib/auth-context';
import { ReactQueryProvider } from '@/components/providers/ReactQueryProvider';

const inter = Inter({ subsets: ['latin'] });

// Base URL for your site - update this for production
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: {
    default: 'Ikaze - Rwanda Lifestyle & Stories',
    template: '%s | Ikaze Rwanda'
  },
  description: 'Discover and share authentic stories about Rwandan culture, food, travel, and daily life. Join our community of writers and readers.',
  keywords: ['Rwanda', 'culture', 'travel', 'food', 'lifestyle', 'stories', 'blog', 'Ikaze'],
  authors: [{ name: 'Ikaze Rwanda' }],
  creator: 'Ikaze Rwanda',
  publisher: 'Ikaze Rwanda',
  
  // Open Graph for social media sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'Ikaze Rwanda',
    title: 'Ikaze - Rwanda Lifestyle & Stories',
    description: 'Discover and share authentic stories about Rwandan culture, food, travel, and daily life.',
    images: [
      {
        url: `${baseUrl}/og-image.jpg`, // We'll create this image
        width: 1200,
        height: 630,
        alt: 'Ikaze - Rwanda Lifestyle & Stories',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Ikaze - Rwanda Lifestyle & Stories',
    description: 'Discover and share authentic stories about Rwandan culture, food, travel, and daily life.',
    images: [`${baseUrl}/og-image.jpg`],
    creator: '@ikazerwanda',
  },
  
 
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Icons
  icons: {
    icon: '/Logo.svg',
    shortcut: '/Logo.svg',
    apple: '/Logo.svg',
  },
  
  // Manifest for PWA (optional)
  manifest: `${baseUrl}/site.webmanifest`,
  
  // Verification for search consoles (add these later)
  // verification: {
  //   google: 'your-google-verification-code',
  //   yandex: 'your-yandex-verification-code',
  //   yahoo: 'your-yahoo-verification-code',
  // },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Additional meta tags */}
        <meta name="theme-color" content="#16a34a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={inter.className}>
        <ReactQueryProvider>
          <AuthProvider>
            <Header />
            <main className="min-h-screen bg-gray-50">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}