import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { DASHBOARD_LINKS } from '@/features/dashboard';

interface UnauthorizedRouteProps {
  isAuthenticated: boolean;
  children: ReactNode;
}

const UnauthorizedRoute: React.FC<UnauthorizedRouteProps> = ({ isAuthenticated, children }) => {
  if (isAuthenticated) {
    return <Navigate to={DASHBOARD_LINKS.DASHBOARD} replace />;
  }

  return <>{children}</>;
};

export default UnauthorizedRoute;
