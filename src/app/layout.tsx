import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/auth-provider';

export const metadata: Metadata = {
  title: 'VisioGold DRC — AI-Powered Mining Intelligence',
  description: 'The premier AI-powered mining intelligence platform for the Democratic Republic of the Congo. Real-time geological intelligence, opportunity scoring, and Monte Carlo simulation.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'VisioGold DRC — AI-Powered Mining Intelligence',
    description: 'Discover, evaluate, and develop gold opportunities in the DRC with unprecedented precision and security.',
    images: ['/og-image.svg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-bg-dark text-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
