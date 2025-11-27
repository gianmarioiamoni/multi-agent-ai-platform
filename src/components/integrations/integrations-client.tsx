/**
 * Integrations Client Component
 * Manages client-side state for integrations page
 * Following SRP: Only handles client-side interaction logic
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/contexts/toast-context';
import { GoogleCalendarCard } from './google-calendar-card';

export const IntegrationsClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check connection status on mount
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  // Handle OAuth callback messages
  useEffect(() => {
    const success = searchParams?.get('success');
    const error = searchParams?.get('error');

    if (success) {
      addToast('success', 'Success', success);
      // Remove query params from URL
      router.replace('/app/integrations');
      // Check status after a short delay to ensure DB is updated
      setTimeout(() => {
        checkConnectionStatus();
      }, 500);
    }

    if (error) {
      addToast('error', 'Connection Failed', error);
      router.replace('/app/integrations');
    }
  }, [searchParams, router, addToast]);

  const checkConnectionStatus = async () => {
    setIsLoading(true);
    try {
      // Check connection status
      const response = await fetch('/api/integrations/google-calendar/status');
      const data = (await response.json()) as { connected: boolean };
      setIsConnected(data.connected);
    } catch {
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <GoogleCalendarCard
        isConnected={isConnected}
        isLoading={isLoading}
        onConnectionChange={checkConnectionStatus}
      />
    </div>
  );
};

