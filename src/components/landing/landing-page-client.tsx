/**
 * Landing Page Client Component
 * Main composition component for landing page
 * Following SRP: Only handles component composition
 */

'use client';

import { useState, useEffect } from 'react';
import { LandingNavbar } from './landing-navbar';
import { LandingHero } from './landing-hero';
import { LandingFeatures } from './landing-features';
import { LandingHowItWorks } from './landing-how-it-works';
import { LandingCTA } from './landing-cta';
import { LandingFooter } from './landing-footer';

// Path to background image - customize this path as needed
// You can also use: '/images/landing-bg-option-1.jpg', '/images/landing-bg-option-2.jpg', etc.
const BACKGROUND_IMAGE_PATH = '/images/landing-bg.jpg';

export const LandingPageClient = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Check if background image exists by attempting to load it
    const img = new Image();
    img.src = BACKGROUND_IMAGE_PATH;
    img.onload = () => {
      setBackgroundImage(BACKGROUND_IMAGE_PATH);
    };
    img.onerror = () => {
      // Image not found, use gradient background instead
      setBackgroundImage(undefined);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <LandingNavbar />
      <LandingHero backgroundImage={backgroundImage} />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingCTA />
      <LandingFooter />
    </div>
  );
};

