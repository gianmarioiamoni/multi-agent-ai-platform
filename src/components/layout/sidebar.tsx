/**
 * Sidebar Component
 * Main navigation sidebar with menu items
 * Following SRP: Only handles sidebar UI and navigation
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigationSections } from '@/config/navigation';
import { cn } from '@/utils/cn';
import type { UserRole } from '@/lib/auth/utils';

interface SidebarProps {
  userRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ userRole, isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();

  const filteredSections = navigationSections.map(section => ({
    ...section,
    items: section.items.filter(item => {
      // Filter admin-only items for non-admin users
      if (item.adminOnly && userRole !== 'admin') {
        return false;
      }
      return true;
    }),
  })).filter(section => section.items.length > 0); // Remove empty sections

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen w-64 bg-[var(--color-card)] border-r border-[var(--color-border)]',
          'transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo/Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--color-border)]">
          <Link href="/app/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-lg">Multi-Agent</span>
          </Link>
          
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-[var(--color-accent)]/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {filteredSections.map((section) => (
            <div key={section.title}>
              <h3 className="px-3 mb-2 text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                          isActive
                            ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-sm'
                            : 'text-[var(--color-foreground)] hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)]'
                        )}
                      >
                        {item.icon}
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className={cn(
                            'px-2 py-0.5 text-xs font-semibold rounded-full',
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                          )}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--color-border)]">
          <div className="px-3 py-2 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20">
            <p className="text-xs font-semibold text-[var(--color-accent)] mb-1">
              🚀 Sprint 1 Active
            </p>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              Building core features
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

