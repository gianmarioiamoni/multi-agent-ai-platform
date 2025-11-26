/**
 * Alert Dialog Component
 * Alert/confirmation dialog component based on Dialog
 * Following SRP: Only handles alert dialog presentation
 */

'use client';

import * as React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './dialog';
import { Button, type ButtonVariant } from './button';

interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const AlertDialog = ({ open, onOpenChange, children }: AlertDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  );
};

const AlertDialogContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DialogContent>
>(({ className, ...props }, ref) => (
  <DialogContent ref={ref} className={className} {...props} />
));
AlertDialogContent.displayName = 'AlertDialogContent';

const AlertDialogHeader = DialogHeader;
const AlertDialogTitle = DialogTitle;
const AlertDialogDescription = DialogDescription;

const AlertDialogFooter = DialogFooter;

interface AlertDialogActionProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'ref'> {
  variant?: ButtonVariant;
}

const AlertDialogAction = React.forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  ({ variant = 'primary', className, ...props }, ref) => (
    <Button ref={ref} variant={variant} className={className} {...props} />
  )
);
AlertDialogAction.displayName = 'AlertDialogAction';

const AlertDialogCancel = React.forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  ({ variant = 'outline', className, ...props }, ref) => (
    <Button ref={ref} variant={variant} className={className} {...props} />
  )
);
AlertDialogCancel.displayName = 'AlertDialogCancel';

const AlertDialogTrigger = DialogTrigger;

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};

