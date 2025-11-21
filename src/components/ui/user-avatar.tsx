/**
 * User Avatar Component
 * Displays user avatar with initials
 * Following SRP: Only handles avatar display
 */

import { getUserInitials } from '@/utils/format';

interface UserAvatarProps {
  name: string | null;
}

export const UserAvatar = ({ name }: UserAvatarProps) => {
  const initials = getUserInitials(name);

  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white text-sm font-semibold">
      {initials}
    </div>
  );
};

