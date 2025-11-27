/**
 * Breadcrumbs Utilities
 * Pure functions for generating breadcrumb data from paths
 * Server-side safe (no client-side dependencies)
 */

export interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

/**
 * Route configuration for breadcrumb generation
 */
const routeConfig: Record<string, string> = {
  '/app/dashboard': 'Dashboard',
  '/app/agents': 'Agents',
  '/app/agents/create': 'Create Agent',
  '/app/workflows': 'Workflows',
  '/app/workflows/create': 'Create Workflow',
  '/app/runs': 'Runs',
  '/app/integrations': 'Integrations',
  '/app/settings': 'Settings',
  '/app/account': 'My Account',
  '/admin': 'Admin Panel',
  '/admin/settings': 'Settings',
};

/**
 * Dynamic route patterns with labels
 */
const dynamicRoutePatterns: Array<{
  pattern: RegExp;
  label: (params: Record<string, string>) => string;
}> = [
  {
    pattern: /^\/app\/agents\/([^/]+)$/,
    label: () => 'Agent Detail', // Will be overridden with actual name
  },
  {
    pattern: /^\/app\/agents\/([^/]+)\/edit$/,
    label: () => 'Edit',
  },
  {
    pattern: /^\/app\/agents\/([^/]+)\/test$/,
    label: () => 'Test Agent',
  },
  {
    pattern: /^\/app\/workflows\/([^/]+)$/,
    label: () => 'Workflow Detail', // Will be overridden with actual name
  },
  {
    pattern: /^\/app\/workflows\/([^/]+)\/edit$/,
    label: () => 'Edit',
  },
  {
    pattern: /^\/app\/runs\/([^/]+)$/,
    label: (params) => `Run #${params.id?.substring(0, 8) || 'Unknown'}`,
  },
];

/**
 * Generates breadcrumb items from a pathname
 * @param pathname - Current pathname (e.g., '/app/agents/123/edit')
 * @param customLabels - Optional map of path segments to custom labels (for dynamic content)
 * @returns Array of breadcrumb items
 */
export function generateBreadcrumbs(
  pathname: string,
  customLabels?: Record<string, string>
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];
  
  // Start with home
  breadcrumbs.push({
    label: 'Home',
    href: '/app/dashboard',
    isActive: pathname === '/app/dashboard',
  });

  // Handle root or dashboard
  if (pathname === '/' || pathname === '/app/dashboard') {
    return breadcrumbs;
  }

  // Check for exact matches first
  if (routeConfig[pathname]) {
    breadcrumbs.push({
      label: routeConfig[pathname],
      href: pathname,
      isActive: true,
    });
    return breadcrumbs;
  }

  // Handle dynamic routes
  let matched = false;
  for (const { pattern, label } of dynamicRoutePatterns) {
    const match = pathname.match(pattern);
    if (match) {
      const params: Record<string, string> = {};
      
      // Extract ID from match groups
      if (match[1]) {
        params.id = match[1];
      }

      // Check if we have a custom label for this path
      const customLabel = customLabels?.[pathname];
      
      // Build parent breadcrumbs based on path structure
      const pathParts = pathname.split('/').filter(Boolean);
      
      // Handle different path structures
      if (pathParts.length >= 4 && (pathParts[3] === 'edit' || pathParts[3] === 'test')) {
        // Pattern: /app/agents/[id]/edit or /app/agents/[id]/test
        // Add parent: Agents
        breadcrumbs.push({
          label: routeConfig['/app/agents'] || 'Agents',
          href: '/app/agents',
          isActive: false,
        });
        
        // Add entity detail (with custom label if available)
        const entityPath = `/${pathParts.slice(0, 3).join('/')}`;
        const entityLabel = customLabels?.[entityPath] || label(params);
        breadcrumbs.push({
          label: entityLabel,
          href: entityPath,
          isActive: false,
        });
        
        // Add current page (edit/test)
        breadcrumbs.push({
          label: customLabel || (pathParts[3] === 'edit' ? 'Edit' : 'Test Agent'),
          href: pathname,
          isActive: true,
        });
      } else {
        // Pattern: /app/agents/[id] or /app/workflows/[id]
        // Add parent section
        const sectionPath = `/${pathParts.slice(0, 2).join('/')}`;
        const sectionLabel = routeConfig[sectionPath];
        if (sectionLabel) {
          breadcrumbs.push({
            label: sectionLabel,
            href: sectionPath,
            isActive: false,
          });
        }
        
        // Add current page
        breadcrumbs.push({
          label: customLabel || label(params),
          href: pathname,
          isActive: true,
        });
      }

      matched = true;
      break;
    }
  }

  if (matched) {
    return breadcrumbs;
  }

  // Fallback: create breadcrumbs from path segments
  const segments = pathname.split('/').filter(Boolean);
  let currentPath = '';

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    // Skip app segment in display
    if (segment === 'app' || segment === 'admin') {
      continue;
    }

    const label = customLabels?.[currentPath] || routeConfig[currentPath] || formatSegmentLabel(segment);
    
    breadcrumbs.push({
      label,
      href: currentPath.startsWith('/app/') || currentPath.startsWith('/admin/') ? currentPath : `/app${currentPath}`,
      isActive: i === segments.length - 1,
    });
  }

  return breadcrumbs;
}

/**
 * Formats a URL segment into a readable label
 */
function formatSegmentLabel(segment: string): string {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Gets the pathname from headers (for Server Components)
 */
export function getPathnameFromHeaders(): string {
  // This will be called in a Server Component context
  // The actual implementation will use headers() from next/headers
  return '';
}

