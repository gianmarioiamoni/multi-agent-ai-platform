/**
 * Auto-Save Hook
 * Handles automatic saving of form data with debounce
 * Following SRP: Only handles auto-save logic
 * 
 * MVP: Last-Write-Wins, minimal indicators
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';
import { getAutoSaveEnabled } from '@/lib/settings/actions';

export type AutoSaveStatus = 'idle' | 'typing' | 'saving' | 'saved' | 'error';

interface UseAutoSaveOptions<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSave: (data: T) => Promise<{ success: boolean; error?: string }>;
  enabled: boolean;
  debounceMs?: number;
  skipInitialSave?: boolean;
  isReady?: boolean; // If false, auto-save won't activate (e.g., while loading data)
}

interface UseAutoSaveReturn {
  status: AutoSaveStatus;
  error: string | null;
  lastSavedAt: Date | null;
}

const DEFAULT_DEBOUNCE_MS = 2500; // 2.5 seconds

/**
 * Hook for auto-saving form data
 * Only saves when form is dirty and valid
 */
export function useAutoSave<T extends FieldValues>({
  form,
  onSave,
  enabled,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  skipInitialSave = true,
  isReady = true,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
  const [status, setStatus] = useState<AutoSaveStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMountRef = useRef(true);
  const isSavingRef = useRef(false);
  const lastSavedDataRef = useRef<string | null>(null);

  // Check if auto-save is enabled in user settings
  useEffect(() => {
    const checkAutoSave = async () => {
      try {
        const enabled = await getAutoSaveEnabled();
        setAutoSaveEnabled(enabled);
      } catch {
        // On error, default to false to be safe
        setAutoSaveEnabled(false);
      }
    };
    checkAutoSave();
  }, []);

  // Deep compare helper to check if data actually changed
  const hasDataChanged = useCallback((currentData: T): boolean => {
    const currentDataStr = JSON.stringify(currentData);
    if (lastSavedDataRef.current === null) {
      return true; // First time, consider it changed
    }
    return currentDataStr !== lastSavedDataRef.current;
  }, []);

  // Save function
  const performSave = useCallback(async (data: T) => {
    if (isSavingRef.current) {
      return; // Already saving, skip
    }

    // Check if form is valid
    const isValid = await form.trigger();
    if (!isValid) {
      setStatus('idle');
      return; // Don't save invalid data
    }

    // Check if data actually changed
    if (!hasDataChanged(data)) {
      setStatus('idle');
      return; // No changes, skip save
    }

    isSavingRef.current = true;
    setStatus('saving');
    setError(null);

    try {
      const result = await onSave(data);

      if (result.success) {
        setStatus('saved');
        setLastSavedAt(new Date());
        lastSavedDataRef.current = JSON.stringify(data);
        
        // Reset to idle after 2 seconds
        setTimeout(() => {
          setStatus('idle');
        }, 2000);
      } else {
        setStatus('error');
        setError(result.error || 'Failed to save');
      }
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      isSavingRef.current = false;
    }
  }, [form, onSave, hasDataChanged]);

  // Watch form changes and trigger auto-save
  useEffect(() => {
    if (!enabled || !autoSaveEnabled || !isReady) {
      return; // Auto-save disabled or not ready
    }

    // Skip on initial mount if requested
    if (skipInitialSave && isInitialMountRef.current) {
      isInitialMountRef.current = false;
      // Store initial data as "last saved"
      const initialData = form.getValues();
      lastSavedDataRef.current = JSON.stringify(initialData);
      return;
    }

    const subscription = form.watch((data) => {
      // Check if form is dirty
      if (!form.formState.isDirty) {
        return;
      }

      // Set typing status
      setStatus('typing');

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer
      debounceTimerRef.current = setTimeout(() => {
        performSave(data as T);
      }, debounceMs);
    });

    return () => {
      subscription.unsubscribe();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [enabled, autoSaveEnabled, isReady, form, debounceMs, performSave, skipInitialSave]);

  // Initialize last saved data when form data is loaded (for edit mode)
  // This resets the "last saved" data when isReady becomes true
  useEffect(() => {
    if (isReady && isInitialMountRef.current) {
      const currentData = form.getValues();
      // Check if we have meaningful data (not just empty defaults)
      if (currentData && Object.keys(currentData).length > 0) {
        // Check if name or other key fields have values (indicating data was loaded)
        const hasData = 'name' in currentData && currentData.name && currentData.name !== '';
        if (hasData) {
          lastSavedDataRef.current = JSON.stringify(currentData);
          isInitialMountRef.current = false;
        }
      }
    }
  }, [isReady, form]);

  return {
    status,
    error,
    lastSavedAt,
  };
}

