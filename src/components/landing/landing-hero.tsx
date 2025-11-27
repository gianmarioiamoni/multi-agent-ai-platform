/**
 * Landing Hero Section Component
 * Hero section with main CTA
 * Following SRP: Only handles hero section rendering
 */

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface LandingHeroProps {
  backgroundImage?: string;
}

export const LandingHero = ({ backgroundImage }: LandingHeroProps) => {
  const backgroundStyle = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {};

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={backgroundStyle}
    >
      {/* Overlay opaco per leggibilità - ridotto per maggiore visibilità dell'immagine */}
      {/* <div className="absolute inset-0 bg-[var(--color-background)]/85 backdrop-blur-sm" /> */}
      <div className="absolute inset-0 bg-black/80" />

      {/* Contenuto */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--color-foreground)] mb-6">
          Automate Your Business
          <br />
          <span className="text-[var(--color-primary)]">With AI Agents</span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-[var(--color-muted-foreground)] mb-8 max-w-3xl mx-auto">
          Orchestrate multiple specialized AI agents to automate complex workflows
          across email, calendar, web search, and databases. Build once, automate forever.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth/signup">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              Get Started Free
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

