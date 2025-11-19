// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/lib/auth-context';
import { ReactQueryProvider } from '@/components/providers/ReactQueryProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ikaze - Rwanda Lifestyle',
  description: 'A platform for sharing and discovering the unique lifestyle of Rwanda.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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