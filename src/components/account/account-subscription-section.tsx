/**
 * Account Subscription Section
 * Display user subscription plan and expiry information
 * Following SRP: Only UI composition
 * SSR: Fully server-side rendered
 */

import { AccountDetailsHeader } from './account-details-section/account-details-header';
import { AccountDetailsItem } from './account-details-section/account-details-item';
import { getUserSubscription, getPlanDisplayName, formatExpiryDate } from '@/lib/subscription/utils';
import { getPlanById } from '@/lib/subscription/constants';
import type { SubscriptionPlan } from '@/types/subscription.types';
import Link from 'next/link';
import { getButtonStyles } from '@/utils/button-styles';
import { cn } from '@/utils/cn';

interface AccountSubscriptionSectionProps {
  isDemo: boolean;
  subscriptionPlan: SubscriptionPlan | null;
  subscriptionExpiresAt: string | null;
  nextPlan?: SubscriptionPlan | null;
  planSwitchAt?: string | null;
}

export const AccountSubscriptionSection = ({
  isDemo,
  subscriptionPlan,
  subscriptionExpiresAt,
  nextPlan,
  planSwitchAt,
}: AccountSubscriptionSectionProps) => {
  // Demo users don't have subscription info
  if (isDemo) {
    return (
      <div className="p-6 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
        <AccountDetailsHeader title="Subscription" />
        <p className="text-sm text-muted-foreground">Demo account - No subscription information</p>
      </div>
    );
  }

  const subscription = getUserSubscription(subscriptionPlan, subscriptionExpiresAt);
  const planInfo = getPlanById(subscription.plan || null);
  const displayName = getPlanDisplayName(subscription.plan);
  const formattedExpiry = formatExpiryDate(subscription.expiresAt);

  return (
    <div className="p-6 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
      <AccountDetailsHeader title="Subscription" />

      <dl className="space-y-4 mb-6">
        <AccountDetailsItem label="Plan" value={displayName} />

        {subscription.isActive && formattedExpiry ? <>
            <AccountDetailsItem label="Expires On" value={formattedExpiry} />
            {subscription.daysRemaining !== null ? <AccountDetailsItem
                label="Days Remaining"
                value={
                  <span
                    className={cn(
                      'font-semibold',
                      subscription.daysRemaining <= 7 && 'text-orange-600',
                      subscription.daysRemaining <= 3 && 'text-red-600'
                    )}
                  >
                    {subscription.daysRemaining} days
                  </span>
                }
              /> : null}
          </> : null}

        {!subscription.isActive && subscription.plan ? <AccountDetailsItem
            label="Status"
            value={<span className="text-red-600 font-semibold">Expired</span>}
          /> : null}

        {!subscription.plan ? <AccountDetailsItem
            label="Status"
            value={<span className="text-muted-foreground">No active subscription</span>}
          /> : null}

        {/* Show scheduled plan change */}
        {nextPlan && planSwitchAt ? <>
            <AccountDetailsItem
              label="Upgrading To"
              value={
                <span className="font-semibold text-green-600">
                  {getPlanDisplayName(nextPlan)}
                </span>
              }
            />
            <AccountDetailsItem
              label="Change Date"
              value={formatExpiryDate(planSwitchAt)}
            />
            <AccountDetailsItem
              label="Status"
              value={<span className="text-blue-600 font-semibold">Plan change scheduled</span>}
            />
          </> : null}
      </dl>

      {planInfo ? <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
          <h4 className="text-sm font-semibold mb-3">Plan Features:</h4>
          <ul className="space-y-2">
            {planInfo.features.slice(0, 4).map((feature, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div> : null}

      <div className="mt-6">
        <Link
          href="/app/pricing"
          className={cn(getButtonStyles('outline', 'md'), 'inline-flex justify-center')}
        >
          {subscription.isActive ? 'Upgrade Plan' : 'Choose Plan'}
        </Link>
      </div>
    </div>
  );
};

