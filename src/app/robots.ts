/**
 * Robots.txt Generator
 * Controls search engine crawling behavior
 */

import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://multiagent.ai';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/app/', // Authenticated app routes
          '/admin/', // Admin routes
          '/api/', // API routes (except public ones)
          '/auth/callback/', // OAuth callbacks
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/app/',
          '/admin/',
          '/api/',
          '/auth/callback/',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

