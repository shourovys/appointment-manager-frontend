import React from 'react';

import type { RouteConfig } from '@/types/route.types';

// Define dashboard route link constants
export const DASHBOARD_LINKS = {
  DASHBOARD: '/',
  PROFILE: '/profile',
};

export const DASHBOARD_ROUTES: RouteConfig[] = [
  {
    index: true,
    element: React.lazy(() => import('../pages/DashboardPage')),
    name: 'Dashboard',
    auth: 'authenticated',
  },
  {
    path: DASHBOARD_LINKS.PROFILE,
    element: React.lazy(() => import('../pages/ProfilePage')),
    name: 'Profile',
    auth: 'authenticated',
  },
];
