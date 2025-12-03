/**
 * Landing Footer Component
 * Footer for landing page
 * Following SRP: Only handles footer rendering
 */

'use client';

import Link from 'next/link';

export const LandingFooter = () => {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-background)] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-[var(--color-primary)] mb-4">
              Multi-Agent AI Platform
            </h3>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Automate your business workflows with AI agents
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-foreground)] mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#features"
                  className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-foreground)] mb-4">Account</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/auth/signup"
                  className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-foreground)] mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--color-border)] text-center">
          <p className="text-sm text-[var(--color-muted-foreground)]">
            © {new Date().getFullYear()} Multi-Agent AI Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

