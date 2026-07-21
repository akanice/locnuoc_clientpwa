import { Outlet, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/AppShell';
import { BottomNav } from '@/components/layout/BottomNav';
import { PullToRefresh } from '@/components/common/PullToRefresh';

const pageTitles: Record<string, string> = {
  '/': 'Trang chủ',
  '/working': 'Làm việc',
  '/statistics': 'Thống kê',
  '/profile': 'Cá nhân',
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
