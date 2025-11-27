/**
 * Account Data Export Component
 * UI for GDPR data export functionality
 * Following SRP: Only handles export UI rendering
 */

'use client';

import { Download, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDataExport } from '@/hooks/gdpr/use-data-export';

export const AccountDataExport = () => {
  const { isExporting, exportData } = useDataExport();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileJson className="h-5 w-5 text-[var(--color-primary)]" />
          Data Export
        </CardTitle>
        <CardDescription>
          Download all your personal data in a structured JSON format (GDPR compliant)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-[var(--color-muted-foreground)] space-y-2">
          <p>
            You have the right to access and receive a copy of all personal data we hold about you.
            The export includes:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Your profile information and settings</li>
            <li>All your agents and workflows</li>
            <li>Workflow execution history and logs</li>
            <li>Tool invocations and results</li>
            <li>Stored integration credentials (metadata only)</li>
            <li>Application logs related to your account</li>
            <li>Notification read status</li>
          </ul>
          <p className="mt-2 text-xs">
            Note: Encrypted credential data is not included in the export for security reasons.
            Only metadata (provider, scopes, expiration) is exported.
          </p>
        </div>
        <Button
          onClick={exportData}
          disabled={isExporting}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export My Data'}
        </Button>
      </CardContent>
    </Card>
  );
};

