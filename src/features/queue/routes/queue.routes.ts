import React from 'react';

import type { RouteConfig } from '@/types/route.types';

// Define queue route link constants
export const QUEUE_LINKS = {
  LIST: '/queue',
};

// Define queue routes
export const QUEUE_ROUTES: RouteConfig[] = [
  {
    name: 'Queue',
    path: QUEUE_LINKS.LIST,
    element: React.lazy(() => import('@/features/queue/pages/QueuePage')),
    auth: 'authenticated',
  },
];
