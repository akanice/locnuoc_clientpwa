import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute, GuestRoute } from '@/app/router/guards';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ROUTES } from '@/constants';

const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const ForgotPasswordPage = lazy(() =>
  import('@/features/auth/pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })),
);
const ResetPasswordPage = lazy(() =>
  import('@/features/auth/pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })),
);
const ChangePasswordPage = lazy(() =>
  import('@/features/auth/pages/ChangePasswordPage').then((m) => ({ default: m.ChangePasswordPage })),
);
const HomePage = lazy(() =>
  import('@/features/home/pages/HomePage').then((m) => ({ default: m.HomePage })),
);
const WorkingPage = lazy(() =>
  import('@/features/working/pages/WorkingPage').then((m) => ({ default: m.WorkingPage })),
);
const StatisticsPage = lazy(() =>
  import('@/features/statistics/pages/StatisticsPage').then((m) => ({ default: m.StatisticsPage })),
);
const ProfilePage = lazy(() =>
  import('@/features/profile/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);

function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: (
          <LazyPage>
            <LoginPage />
          </LazyPage>
        ),
      },
      {
        path: ROUTES.FORGOT_PASSWORD,
        element: (
          <LazyPage>
            <ForgotPasswordPage />
          </LazyPage>
        ),
      },
      {
        path: ROUTES.RESET_PASSWORD,
        element: (
          <LazyPage>
            <ResetPasswordPage />
          </LazyPage>
        ),
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: ROUTES.CHANGE_PASSWORD,
        element: (
          <LazyPage>
            <ChangePasswordPage />
          </LazyPage>
        ),
      },
      {
        element: <MainLayout />,
        children: [
          {
            path: ROUTES.HOME,
            element: (
              <LazyPage>
                <HomePage />
              </LazyPage>
            ),
          },
          {
            path: ROUTES.WORKING,
            element: (
              <LazyPage>
                <WorkingPage />
              </LazyPage>
            ),
          },
          {
            path: ROUTES.STATISTICS,
            element: (
              <LazyPage>
                <StatisticsPage />
              </LazyPage>
            ),
          },
          {
            path: ROUTES.PROFILE,
            element: (
              <LazyPage>
                <ProfilePage />
              </LazyPage>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.HOME} replace />,
  },
]);
