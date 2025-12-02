import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/contexts/toast-context';
import { ToastContainer } from '@/components/ui/toast-container';
import { CookieBanner } from '@/components/cookie-banner';
import { BreadcrumbsProvider } from '@/contexts/breadcrumbs-context';
import { getAppUrl } from '@/utils/url';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const siteUrl = getAppUrl();
const siteName = 'Multi-Agent AI Platform';
const siteDescription = 'Automate your business workflows with AI agents. Create intelligent workflows, manage multiple AI agents, and streamline your operations with our powerful multi-agent platform.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    'AI',
    'artificial intelligence',
    'automation',
    'agents',
    'workflow',
    'business automation',
    'multi-agent system',
    'AI platform',
    'workflow automation',
    'intelligent agents',
  ],
  authors: [{ name: 'Multi-Agent AI Platform' }],
  creator: 'Multi-Agent AI Platform',
  publisher: 'Multi-Agent AI Platform',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
    images: ['/og-image.png'],
    creator: '@multiagentai',
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
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
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
          <BreadcrumbsProvider>
            {children}
            <ToastContainer />
            <CookieBanner />
          </BreadcrumbsProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
