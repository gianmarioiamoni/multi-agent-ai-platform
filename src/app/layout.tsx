import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/contexts/toast-context';
import { ToastContainer } from '@/components/ui/toast-container';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Multi-Agent AI Platform',
    template: '%s | Multi-Agent AI Platform',
  },
  description: 'Automate your business workflows with AI agents',
  keywords: ['AI', 'automation', 'agents', 'workflow', 'business'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <ToastProvider>
          {children}
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
