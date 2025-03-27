import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth/auth-context';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SimCase AI | Healthcare Simulation Case Generator',
  description: 'AI-powered platform for creating realistic healthcare simulation cases',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
} 