import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore, selectIsAuthenticated, selectIsHydrated } from '@/stores/auth.store';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ROUTES } from '@/constants';

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isHydrated = useAuthStore(selectIsHydrated);
  const location = useLocation();

  if (!isHydrated) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export function GuestRoute() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isHydrated = useAuthStore(selectIsHydrated);
  const location = useLocation();

  if (!isHydrated) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
    return <Navigate to={from || ROUTES.HOME} replace />;
  }

  return <Outlet />;
}
