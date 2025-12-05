/**
 * Landing Navbar Component
 * Public navbar for landing page
 * Following SRP: Only handles navbar rendering
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export const LandingNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--color-border)]/20 backdrop-blur-md bg-[var(--color-background)]/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Multi-Agent AI Platform"
              width={32}
              height={32}
              className="w-8 h-8"
              priority
            />
            <span className="text-xl font-bold text-[var(--color-primary)]">
              Multi-Agent AI Platform
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors"
            >
              How It Works
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

