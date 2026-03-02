import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/auth-provider';

export const metadata: Metadata = {
  title: 'VisioGold DRC',
  description: 'Secure multi-tenant mining project management platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-black text-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
