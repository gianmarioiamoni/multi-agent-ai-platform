/**
 * Account Deletion Section Component
 * Section for account deletion with confirmation dialog
 * Following SRP: Only handles account deletion UI
 */

'use client';

import { useAccountDeletion } from '@/hooks/account/use-account-deletion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AccountDeletionSectionProps {
  isDemo: boolean;
}

export const AccountDeletionSection = ({ isDemo }: AccountDeletionSectionProps) => {
  const { isLoading, isDialogOpen, openDialog, closeDialog, handleDelete } = useAccountDeletion();

  if (isDemo) {
    return (
      <div>
        <h3 className="text-base font-semibold text-[var(--color-foreground)] mb-2">
          Delete Account
        </h3>
        <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
          Account deletion is not allowed for demo accounts.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h3 className="text-base font-semibold text-[var(--color-foreground)] mb-2">
          Delete Account
        </h3>
        <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <Button
          variant="destructive"
          onClick={openDialog}
          disabled={isLoading}
        >
          Delete Account
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone and will permanently delete:
            </DialogDescription>
          </DialogHeader>
          <ul className="list-disc list-inside text-sm text-[var(--color-muted-foreground)] space-y-1 mb-4 ml-4">
            <li>Your profile and account information</li>
            <li>All your agents and workflows</li>
            <li>All workflow runs and execution history</li>
            <li>All your data and settings</li>
          </ul>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDialog}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

