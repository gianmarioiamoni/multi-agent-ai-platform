/**
 * Breadcrumbs Context
 * Allows Server Components to register custom breadcrumb labels
 * that will be used by the Breadcrumbs component in the layout
 */

'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface BreadcrumbsContextType {
  customLabels: Record<string, string>;
  setCustomLabels: (labels: Record<string, string>) => void;
}

const BreadcrumbsContext = createContext<BreadcrumbsContextType | undefined>(undefined);

export const BreadcrumbsProvider = ({ children }: { children: ReactNode }) => {
  const [customLabels, setCustomLabels] = useState<Record<string, string>>({});

  return (
    <BreadcrumbsContext.Provider value={{ customLabels, setCustomLabels }}>
      {children}
    </BreadcrumbsContext.Provider>
  );
};

export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbsContext);
  if (!context) {
    throw new Error('useBreadcrumbs must be used within BreadcrumbsProvider');
  }
  return context;
};

