import MainLayout from '@/components/layouts/MainLayout';
import { APPOINTMENTS_ROUTES } from '@/features/appointments';
import { AUTH_ROUTES } from '@/features/auth';
import { DASHBOARD_LINKS, DASHBOARD_ROUTES } from '@/features/dashboard';
import { DEMO_ROUTES } from '@/features/demo';
import { QUEUE_ROUTES } from '@/features/queue';
import { SERVICES_DEFINITION_ROUTES } from '@/features/services-definition';
import { STAFF_ROUTES } from '@/features/staff';
import type { RouteConfig } from '@/types/route.types';

// Define all routes in a centralized configuration
export const routes: RouteConfig[] = [
  // Auth routes (public/guest)
  ...AUTH_ROUTES,
  // Authenticated routes
  {
    element: MainLayout,
    isLayout: true,
    path: DASHBOARD_LINKS.DASHBOARD,
    auth: 'authenticated',
    children: [
      ...DEMO_ROUTES,
      ...DASHBOARD_ROUTES,
      ...STAFF_ROUTES,
      ...SERVICES_DEFINITION_ROUTES,
      ...APPOINTMENTS_ROUTES,
      ...QUEUE_ROUTES,
    ],
  },
];

// Export route configurations for use in the application
export default routes;
