/**
 * Account Security Notice Component
 * Displays security and privacy information
 * Following SRP: Only handles security notice rendering
 */

export const AccountSecurityNotice = () => {
  return (
    <div className="p-6 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20">
      <div className="flex items-start gap-3">
        <svg 
          className="w-5 h-5 text-[var(--color-accent)] mt-0.5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
          />
        </svg>
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-foreground)] mb-1">
            Security & Privacy
          </h3>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Your account is secured with Supabase authentication. Email and password management features coming soon.
          </p>
        </div>
      </div>
    </div>
  );
};

