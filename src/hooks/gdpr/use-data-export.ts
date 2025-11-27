/**
 * GDPR Data Export Hook
 * Handles data export functionality
 * Following SRP: Only handles export logic
 */

'use client';

import { useState } from 'react';
import { useToast } from '@/contexts/toast-context';

interface UseDataExportReturn {
  isExporting: boolean;
  exportData: () => Promise<void>;
}

/**
 * Hook for managing GDPR data export
 */
export const useDataExport = (): UseDataExportReturn => {
  const [isExporting, setIsExporting] = useState(false);
  const { addToast } = useToast();

  const exportData = async () => {
    setIsExporting(true);

    try {
      // Fetch export data from API endpoint
      const response = await fetch('/api/gdpr/export');

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to export data');
      }

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : `user-data-export-${new Date().toISOString().split('T')[0]}.json`;

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      addToast('success', 'Data exported successfully', 'Your data has been downloaded as a JSON file.');
    } catch (error) {
      console.error('Error exporting data:', error);
      addToast(
        'error',
        'Export failed',
        error instanceof Error ? error.message : 'Failed to export your data. Please try again.'
      );
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    exportData,
  };
};

