import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore, selectIsAuthenticated, selectIsHydrated } from '@/stores/auth.store';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ROUTES } from '@/constants';
import { isAccessTokenExpired, refreshIfExpired } from '@/lib/auth/session';
import { isSessionExpiredError } from '@/lib/auth/session-error';

function useResumeTick(): number {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const bump = () => {
      if (document.visibilityState === 'hidden') return;
      setTick((value) => value + 1);
    };

    document.addEventListener('visibilitychange', bump);
    window.addEventListener('focus', bump);
    window.addEventListener('pageshow', bump);
    const timer = window.setInterval(bump, 30_000);

    return () => {
      document.removeEventListener('visibilitychange', bump);
      window.removeEventListener('focus', bump);
      window.removeEventListener('pageshow', bump);
      window.clearInterval(timer);
    };
  }, []);

  return tick;
}

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isHydrated = useAuthStore(selectIsHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const expiresAt = useAuthStore((state) => state.expiresAt);
  const location = useLocation();
  const resumeTick = useResumeTick();
  const [allowExpiredUi, setAllowExpiredUi] = useState(false);

  const sessionExpired = isAuthenticated && (!accessToken || isAccessTokenExpired(expiresAt));

  useEffect(() => {
    if (!isHydrated || !isAuthenticated || !sessionExpired) return;

    let cancelled = false;
    setAllowExpiredUi(false);

    refreshIfExpired().catch((error: unknown) => {
      if (cancelled || isSessionExpiredError(error)) return;
      setAllowExpiredUi(true);
    });

    return () => {
      cancelled = true;
    };
  }, [isHydrated, isAuthenticated, sessionExpired, resumeTick]);

  if (!isHydrated || (sessionExpired && !allowExpiredUi)) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !accessToken) {
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
