import React from 'react';

import type { RouteConfig } from '@/types/route.types';

// Define auth route link constantan
export const DEMO_LINKS = {
  ERROR_DEMO: '/error-demo',
};

// Define auth routes
export const DEMO_ROUTES: RouteConfig[] = [
  {
    path: DEMO_LINKS.ERROR_DEMO,
    element: React.lazy(() => import('@/features/demo/pages/ErrorHandlingDemo')),
    name: 'ErrorHandlingDemo',
    auth: 'public',
  },
];
