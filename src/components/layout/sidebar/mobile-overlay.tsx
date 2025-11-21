/**
 * Mobile Overlay Component
 * Overlay to close sidebar on mobile
 * Following SRP: Only handles overlay UI
 */

interface MobileOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

export const MobileOverlay = ({ isVisible, onClose }: MobileOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-40 lg:hidden"
      onClick={onClose}
    />
  );
};

