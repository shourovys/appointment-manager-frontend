import React from 'react';

import type { RouteConfig } from '@/types/route.types';

// Define appointments route link constants
export const APPOINTMENTS_LINKS = {
  LIST: '/appointments',
};

// Define appointments routes
export const APPOINTMENTS_ROUTES: RouteConfig[] = [
  {
    name: 'Appointments',
    path: APPOINTMENTS_LINKS.LIST,
    element: React.lazy(() => import('@/features/appointments/pages/AppointmentsListPage')),
    auth: 'authenticated',
  },
];
