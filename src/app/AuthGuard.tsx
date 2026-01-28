import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { AUTH_LINKS } from '@/features/auth';

interface AuthGuardProps {
  isAuthenticated: boolean;
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to={AUTH_LINKS.LOGIN} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
