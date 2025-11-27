/**
 * Google Calendar Card Actions Component
 * Connect/Disconnect buttons
 * Following SRP: Only handles action buttons rendering
 */

'use client';

import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GoogleCalendarCardActionsProps {
  isLoading: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnecting: boolean;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
}

export const GoogleCalendarCardActions = ({
  isLoading,
  isConnected,
  isConnecting,
  isDisconnecting,
  onConnect,
  onDisconnect,
}: GoogleCalendarCardActionsProps) => {
  return (
    <CardFooter className="flex justify-end">
      {isLoading ? (
        <Button disabled>Loading...</Button>
      ) : isConnected ? (
        <Button variant="destructive" onClick={onDisconnect} disabled={isDisconnecting}>
          {isDisconnecting ? 'Disconnecting...' : 'Disconnect Google Calendar'}
        </Button>
      ) : (
        <Button onClick={onConnect} disabled={isConnecting}>
          {isConnecting ? 'Connecting...' : 'Connect Google Calendar'}
        </Button>
      )}
    </CardFooter>
  );
};

