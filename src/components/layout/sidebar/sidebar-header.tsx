/**
 * Sidebar Header Component
 * Logo and mobile close button
 * Following SRP: Only handles header UI
 */

import Link from 'next/link';
import Image from 'next/image';

interface SidebarHeaderProps {
  onClose: () => void;
}

export const SidebarHeader = ({ onClose }: SidebarHeaderProps) => {
  return (
    <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--color-border)]">
      {/* Logo */}
      <Link href="/app/dashboard" className="flex items-center gap-2">
        <Image
          src="/logo.svg"
          alt="Multi-Agent AI Platform"
          width={32}
          height={32}
          className="w-8 h-8"
          priority
        />
        <span className="font-bold text-lg">Multi-Agent</span>
      </Link>
      
      {/* Mobile Close Button */}
      <button
        onClick={onClose}
        className="lg:hidden p-2 hover:bg-[var(--color-accent)]/10 rounded-lg transition-colors"
        aria-label="Close menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

