/**
 * Google Calendar Integration Card Component
 * Main composition component for Google Calendar integration
 * Following SRP: Only handles component composition
 */

'use client';

import { Card } from '@/components/ui/card';
import { useGoogleCalendarCard } from '@/hooks/integrations/use-google-calendar-card';
import { GoogleCalendarCardHeader } from './google-calendar-card/google-calendar-card-header';
import { GoogleCalendarCardFeatures } from './google-calendar-card/google-calendar-card-features';
import { GoogleCalendarCardActions } from './google-calendar-card/google-calendar-card-actions';

interface GoogleCalendarCardProps {
  isConnected: boolean;
  isLoading: boolean;
  onConnectionChange: () => Promise<void>;
}

export function GoogleCalendarCard({
  isConnected,
  isLoading,
  onConnectionChange,
}: GoogleCalendarCardProps) {
  const { isConnecting, isDisconnecting, handleConnect, handleDisconnect } =
    useGoogleCalendarCard({ onConnectionChange });

  return (
    <Card>
      <GoogleCalendarCardHeader isConnected={isConnected} />
      <GoogleCalendarCardFeatures />
      <GoogleCalendarCardActions
        isLoading={isLoading}
        isConnected={isConnected}
        isConnecting={isConnecting}
        isDisconnecting={isDisconnecting}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />
    </Card>
  );
}

