import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { formatNumber } from '@/utils';

export function StatisticsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['statistics'],
    queryFn: async () => ({
      totalCalls: 156,
      totalOrders: 42,
      revenue: 125000000,
      avgCallDuration: '3:45',
      weeklyData: [
        { day: 'T2', calls: 28, orders: 8 },
        { day: 'T3', calls: 32, orders: 10 },
        { day: 'T4', calls: 25, orders: 6 },
        { day: 'T5', calls: 30, orders: 9 },
        { day: 'T6', calls: 22, orders: 5 },
        { day: 'T7', calls: 12, orders: 3 },
        { day: 'CN', calls: 7, orders: 1 },
      ],
      trends: {
        calls: 12.5,
        orders: -3.2,
        revenue: 8.7,
      },
    }),
  });

  if (isLoading) return <PageSkeleton />;

  const maxCalls = Math.max(...(stats?.weeklyData.map((d) => d.calls) ?? [1]));

  return (
    <>
      <div className="card" style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
          Thống kê tháng {dayjs().format('MM/YYYY')}
        </p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-card__value">{formatNumber(stats?.totalCalls ?? 0)}</div>
          <div className="stat-card__label">Tổng cuộc gọi</div>
          <TrendBadge value={stats?.trends.calls ?? 0} />
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{formatNumber(stats?.totalOrders ?? 0)}</div>
          <div className="stat-card__label">Đơn hàng</div>
          <TrendBadge value={stats?.trends.orders ?? 0} />
        </div>
        <div className="stat-card">
          <div className="stat-card__value">
            {(stats?.revenue ?? 0) / 1000000}M
          </div>
          <div className="stat-card__label">Doanh thu</div>
          <TrendBadge value={stats?.trends.revenue ?? 0} />
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{stats?.avgCallDuration}</div>
          <div className="stat-card__label">TB thời gian gọi</div>
        </div>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Cuộc gọi theo tuần</h3>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
          {stats?.weeklyData.map((item) => (
            <div
              key={item.day}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: `${(item.calls / maxCalls) * 100}%`,
                  minHeight: 4,
                  background: 'var(--color-primary)',
                  borderRadius: 4,
                  opacity: 0.8,
                }}
              />
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function TrendBadge({ value }: { value: number }) {
  const isPositive = value >= 0;
  const Icon = isPositive ? HiTrendingUp : HiTrendingDown;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        fontSize: 12,
        marginTop: 4,
        color: isPositive ? 'var(--color-success)' : 'var(--color-danger)',
      }}
    >
      <Icon size={14} />
      {Math.abs(value)}%
    </div>
  );
}
