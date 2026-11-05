import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../authentication/auth-store';
import { UserRole } from '../../foundation/types';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

function getRoleDashboard(role: UserRole): string {
  switch (role) {
    case 'mentor': return '/mentor/dashboard';
    case 'admin': return '/admin';
    default: return '/dashboard';
  }
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleDashboard(user.role)} replace />;
  }

  return <Outlet />;
}

export function RoleRedirect() {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  return <Navigate to={getRoleDashboard(user.role)} replace />;
}
