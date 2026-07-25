import { Outlet, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/AppShell';
import { BottomNav } from '@/components/layout/BottomNav';
import { PullToRefresh } from '@/components/common/PullToRefresh';
import { ROUTES } from '@/constants';

const pageTitles: Record<string, string> = {
  [ROUTES.HOME]: 'Trang chủ',
  [ROUTES.WORKING]: 'Làm việc',
  [ROUTES.STATISTICS]: 'Thống kê',
  [ROUTES.STATISTICS_BY_PACKAGE]: 'Thống kê theo gói data',
  [ROUTES.STATISTICS_CUSTOMER_HISTORY]: 'Lịch sử KH',
  [ROUTES.PROFILE]: 'Cá nhân',
};

export function MainLayout() {
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || 'LocNuoc';

  const handleRefresh = async () => {
    await queryClient.invalidateQueries();
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  return (
    <>
      <AppShell title={title}>
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="animate-fade-in p-4">
            <Outlet />
          </div>
        </PullToRefresh>
      </AppShell>
      <BottomNav />
    </>
  );
}
