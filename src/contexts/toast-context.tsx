/**
 * Toast Context Provider
 * Centralized error and notification handling
 * Following SRP: This context only manages toast notifications
 */

'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Toast, ToastType } from '@/types/common.types';

interface ToastContextValue {
  toasts: Toast[];
  addToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, title: string, message?: string, duration = 5000) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const toast: Toast = { id, type, title, message, duration };

      setToasts((prev) => [...prev, toast]);

      // Auto-remove toast after duration
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, message?: string) => {
      addToast('success', title, message);
    },
    [addToast]
  );

  const error = useCallback(
    (title: string, message?: string) => {
      addToast('error', title, message);
    },
    [addToast]
  );

  const warning = useCallback(
    (title: string, message?: string) => {
      addToast('warning', title, message);
    },
    [addToast]
  );

  const info = useCallback(
    (title: string, message?: string) => {
      addToast('info', title, message);
    },
    [addToast]
  );

  const value: ToastContextValue = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

