/**
 * Auth Divider Component
 * Divider with text for auth forms
 * Following SRP: Only handles divider display
 */

interface AuthDividerProps {
  text?: string;
}

export const AuthDivider = ({ text = 'Or continue with email' }: AuthDividerProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-card px-2 text-muted-foreground">
          {text}
        </span>
      </div>
    </div>
  );
};

