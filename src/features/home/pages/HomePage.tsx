import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { HiPhone, HiCheckCircle, HiClock } from 'react-icons/hi';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { useAuthStore, selectUser } from '@/stores/auth.store';
import { formatNumber } from '@/utils';

dayjs.locale('vi');

export function HomePage() {
  const user = useAuthStore(selectUser);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => ({
      todayCalls: 24,
      completedCalls: 18,
      pendingCalls: 6,
      conversionRate: 75,
    }),
    staleTime: 1000 * 60 * 2,
  });

  if (isLoading) return <PageSkeleton />;

  return (
    <>
      <div className="card" style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
          {dayjs().format('dddd, DD/MM/YYYY')}
        </p>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 4 }}>
          Xin chào, {user?.name?.split(' ').pop()}! 👋
        </h2>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <HiPhone style={{ fontSize: 24, color: 'var(--color-primary)', margin: '0 auto 8px' }} />
          <div className="stat-card__value">{formatNumber(stats?.todayCalls ?? 0)}</div>
          <div className="stat-card__label">Cuộc gọi hôm nay</div>
        </div>
        <div className="stat-card">
          <HiCheckCircle style={{ fontSize: 24, color: 'var(--color-success)', margin: '0 auto 8px' }} />
          <div className="stat-card__value">{formatNumber(stats?.completedCalls ?? 0)}</div>
          <div className="stat-card__label">Hoàn thành</div>
        </div>
        <div className="stat-card">
          <HiClock style={{ fontSize: 24, color: 'var(--color-warning)', margin: '0 auto 8px' }} />
          <div className="stat-card__value">{formatNumber(stats?.pendingCalls ?? 0)}</div>
          <div className="stat-card__label">Đang chờ</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{stats?.conversionRate ?? 0}%</div>
          <div className="stat-card__label">Tỷ lệ chốt</div>
        </div>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Hoạt động gần đây</h3>
      <div className="card">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', textAlign: 'center', padding: '16px 0' }}>
          Chưa có hoạt động nào hôm nay. Bắt đầu gọi điện tại tab Working!
        </p>
      </div>
    </>
  );
}
