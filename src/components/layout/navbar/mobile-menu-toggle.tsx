/**
 * Mobile Menu Toggle Component
 * Button to toggle mobile sidebar menu
 * Following SRP: Only handles menu toggle button UI
 */

interface MobileMenuToggleProps {
  onToggle: () => void;
}

export const MobileMenuToggle = ({ onToggle }: MobileMenuToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className="lg:hidden p-2 hover:bg-[var(--color-accent)]/10 rounded-lg transition-colors"
      aria-label="Toggle menu"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
};

