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

interface AppLayoutClientProps {
  user: UserProfile;
  children: React.ReactNode;
}

export const AppLayoutClient = ({ user, children }: AppLayoutClientProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Sidebar */}
      <Sidebar
        userRole={user.role}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Navbar */}
        <Navbar user={user} onMenuToggle={handleToggleSidebar} />

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

