import React from 'react';

import type { RouteConfig } from '@/types/route.types';

// Define services definition route link constants
export const SERVICES_DEFINITION_LINKS = {
  LIST: '/services',
};

// Define services definition routes
export const SERVICES_DEFINITION_ROUTES: RouteConfig[] = [
  {
    name: 'Services',
    path: SERVICES_DEFINITION_LINKS.LIST,
    element: React.lazy(
      () => import('@/features/services-definition/pages/ServicesDefinitionListPage')
    ),
    auth: 'authenticated',
  },
];
