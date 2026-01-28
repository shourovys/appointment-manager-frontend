import React from 'react';

import type { RouteConfig } from '@/types/route.types';

// Define auth route link constantan
export const AUTH_LINKS = {
  LOGIN: '/login',
  SIGNUP: '/signup',
};

// Define auth routes
export const AUTH_ROUTES: RouteConfig[] = [
  {
    name: 'Login',
    path: AUTH_LINKS.LOGIN,
    element: React.lazy(() => import('@/features/auth/pages/LoginPage')),
    auth: 'guest',
  },
  {
    name: 'Signup',
    path: AUTH_LINKS.SIGNUP,
    element: React.lazy(() => import('@/features/auth/pages/SignupPage')),
    auth: 'guest',
  },
];
