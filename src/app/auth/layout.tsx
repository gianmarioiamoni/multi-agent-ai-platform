/**
 * Auth Layout
 * Layout for authentication pages (login, signup)
 * Server Component by default for better performance
 */

import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-h2 mb-2">Multi-Agent AI Platform</h1>
          <p className="text-muted-foreground">
            Automate your business workflows with AI agents
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}

