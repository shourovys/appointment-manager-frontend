import React from 'react';

import type { RouteConfig } from '@/types/route.types';

// Define staff route link constants
export const STAFF_LINKS = {
  LIST: '/staff',
};

// Define staff routes
export const STAFF_ROUTES: RouteConfig[] = [
  {
    name: 'Staff',
    path: STAFF_LINKS.LIST,
    element: React.lazy(() => import('@/features/staff/pages/StaffListPage')),
    auth: 'authenticated',
  },
];
