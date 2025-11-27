/**
 * Landing CTA Section Component
 * Call-to-action section
 * Following SRP: Only handles CTA section rendering
 */

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const LandingCTA = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-[var(--color-primary)]/10 via-[var(--color-accent)]/10 to-[var(--color-primary)]/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-foreground)] mb-4">
          Ready to Automate Your Workflows?
        </h2>
        <p className="text-lg text-[var(--color-muted-foreground)] mb-8 max-w-2xl mx-auto">
          Start building your AI-powered automation platform today. No credit card required.
        </p>
        <Link href="/auth/signup">
          <Button variant="primary" size="lg">
            Get Started Free
          </Button>
        </Link>
      </div>
    </section>
  );
};

