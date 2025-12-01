/**
 * App Layout Client Component
 * Client-side layout with sidebar state management
 * Following SRP: Only handles layout state and composition
 */

'use client';

import { useState } from 'react';
import type { UserProfile } from '@/lib/auth/utils';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';

import { DemoModeBanner } from '@/components/demo/demo-mode-banner';

interface AppLayoutClientProps {
  user: UserProfile;
  isDemo: boolean;
  children: React.ReactNode;
}

export const AppLayoutClient = ({ user, isDemo, children }: AppLayoutClientProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Demo Mode Banner - Above everything */}
      {isDemo ? <div className="sticky top-0 z-50">
          <DemoModeBanner />
        </div> : null}

      {/* Sidebar */}
      <Sidebar
        userRole={user.role}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Navbar */}
        <Navbar user={user} isDemo={isDemo} onMenuToggle={handleToggleSidebar} />

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8">
          {/* Breadcrumbs - positioned at top left, small and non-invasive */}
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </div>
  );
};

