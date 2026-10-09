import { Navigate, Outlet } from 'react-router-dom';
import { homeFor, useAuth } from './AuthContext';
import type { Role } from '../types';

export default function ProtectedRoute({ roles }: { roles?: Role[] }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={homeFor(user.role)} replace />;
  }
  return <Outlet />;
}