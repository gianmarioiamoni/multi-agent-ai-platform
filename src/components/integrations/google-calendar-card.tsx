/**
 * Google Calendar Integration Card
 * UI component for Google Calendar integration
 * Following SRP: Only handles Google Calendar UI presentation
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/toast-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GoogleCalendarCardProps {
  isConnected: boolean;
  isLoading: boolean;
  onConnectionChange: () => Promise<void>;
}

export function GoogleCalendarCard({ isConnected, isLoading, onConnectionChange }: GoogleCalendarCardProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch('/api/integrations/google-calendar/auth-url');
      const data = await response.json() as { url?: string; error?: string };

      if (data.error || !data.url) {
        addToast('error', 'Connection Failed', data.error || 'Failed to get authorization URL');
        return;
      }

      window.location.href = data.url;
    } catch {
      addToast('error', 'Connection Failed', 'An unexpected error occurred');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Google Calendar? Agents using this integration will stop working.')) {
      return;
    }

    setIsDisconnecting(true);
    try {
      const response = await fetch('/api/integrations/google-calendar/disconnect', {
        method: 'POST',
      });
      const data = await response.json() as { success?: boolean; error?: string };

      if (!data.success) {
        addToast('error', 'Disconnect Failed', data.error || 'Failed to disconnect');
        return;
      }

      addToast('success', 'Disconnected', 'Google Calendar has been disconnected');
      await onConnectionChange();
    } catch {
      addToast('error', 'Disconnect Failed', 'An unexpected error occurred');
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5zm7 4h5v5h-5v-5z" />
              </svg>
              Google Calendar
            </CardTitle>
            <CardDescription>
              Connect your Google Calendar to let agents create and view calendar events
            </CardDescription>
          </div>
          {isConnected && (
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-500/20 text-green-500">
              Connected
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-[var(--color-muted-foreground)]">
            When connected, agents can:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-[var(--color-muted-foreground)] ml-2">
            <li>List your upcoming calendar events</li>
            <li>Create new events and meetings</li>
            <li>Manage event attendees</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        {isLoading ? (
          <Button disabled>Loading...</Button>
        ) : isConnected ? (
          <Button
            variant="destructive"
            onClick={handleDisconnect}
            disabled={isDisconnecting}
          >
            {isDisconnecting ? 'Disconnecting...' : 'Disconnect Google Calendar'}
          </Button>
        ) : (
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect Google Calendar'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

