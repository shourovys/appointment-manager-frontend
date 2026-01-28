import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuthStore } from '../store/auth.store';

interface PrivateRouteGuardProps {
  children: ReactNode;
}

export function PrivateRouteGuard({ children }: PrivateRouteGuardProps): ReactNode {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
