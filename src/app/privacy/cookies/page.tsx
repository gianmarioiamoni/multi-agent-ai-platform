/**
 * Cookie Preferences Page
 * GDPR-compliant cookie management page
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  getCookiePreferences,
  saveCookiePreferences,
  acceptAllCookies,
  rejectOptionalCookies,
  type CookiePreferences,
  type CookieCategory,
} from '@/lib/cookies/storage';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/toast-context';

export default function CookiePreferencesPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = getCookiePreferences();
    setPreferences(saved || {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    });
    setIsLoading(false);
  }, []);

  const handleToggle = (category: CookieCategory, enabled: boolean) => {
    if (category === 'necessary') {
      return; // Cannot disable necessary cookies
    }

    const updated = {
      ...preferences!,
      [category]: enabled,
    };
    setPreferences(updated);
  };

  const handleSave = () => {
    if (preferences) {
      saveCookiePreferences(preferences);
      addToast('success', 'Preferences saved', 'Your cookie preferences have been saved successfully.');
      router.push('/');
    }
  };

  const handleAcceptAll = () => {
    acceptAllCookies();
    setPreferences({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    });
    addToast('success', 'All cookies accepted', 'All cookies have been enabled.');
    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  const handleRejectOptional = () => {
    rejectOptionalCookies();
    setPreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    });
    addToast('success', 'Optional cookies rejected', 'Only necessary cookies are now enabled.');
    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-4xl">
        <p className="text-[var(--color-muted-foreground)]">Loading preferences...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-4xl">
      <div className="space-y-8">
        <Link
          href="/app/dashboard"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-foreground)] mb-2">
            Cookie Preferences
          </h1>
          <p className="text-[var(--color-muted-foreground)]">
            Manage your cookie preferences. You can enable or disable different types of cookies below.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Necessary Cookies</CardTitle>
            <CardDescription>
              Essential cookies required for the website to function properly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="necessary" className="text-base font-medium">
                  Always Active
                </Label>
                <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
                  These cookies are essential for the website to function and cannot be switched off.
                  They include authentication, security, and basic functionality cookies.
                </p>
              </div>
              <Switch
                id="necessary"
                checked={true}
                disabled
                className="ml-4"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics Cookies</CardTitle>
            <CardDescription>
              Help us understand how visitors interact with our website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Label htmlFor="analytics" className="text-base font-medium">
                  Analytics & Performance
                </Label>
                <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
                  These cookies allow us to count visits and traffic sources so we can measure and improve
                  the performance of our site. They help us understand which pages are most and least
                  popular and see how visitors move around the site.
                </p>
              </div>
              <Switch
                id="analytics"
                checked={preferences?.analytics ?? false}
                onCheckedChange={(checked) => handleToggle('analytics', checked)}
                className="ml-4 mt-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Marketing Cookies</CardTitle>
            <CardDescription>
              Used to deliver relevant advertisements and track campaign performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Label htmlFor="marketing" className="text-base font-medium">
                  Marketing & Advertising
                </Label>
                <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
                  These cookies may be set through our site by advertising partners. They may be used
                  to build a profile of your interests and show you relevant content on other sites.
                  They do not store directly personal information but are based on uniquely identifying
                  your browser and internet device.
                </p>
              </div>
              <Switch
                id="marketing"
                checked={preferences?.marketing ?? false}
                onCheckedChange={(checked) => handleToggle('marketing', checked)}
                className="ml-4 mt-1"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button variant="outline" onClick={handleRejectOptional}>
            Reject Optional
          </Button>
          <Button variant="outline" onClick={handleAcceptAll}>
            Accept All
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Preferences
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>More Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[var(--color-foreground)]">
            <p>
              For more detailed information about how we use cookies, please read our{' '}
              <Link href="/privacy" className="text-[var(--color-primary)] hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
            <p>
              You can change these preferences at any time. Changes will apply immediately and affect
              your future visits to our website.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

