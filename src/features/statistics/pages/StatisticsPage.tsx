import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { formatNumber } from '@/utils';

const cardClass =
  'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800';
const statCardClass =
  'rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800';

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
      <div className={`${cardClass} mb-4`}>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Thống kê tháng {dayjs().format('MM/YYYY')}
        </p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className={statCardClass}>
          <div className="text-2xl font-bold text-primary">
            {formatNumber(stats?.totalCalls ?? 0)}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Tổng cuộc gọi</div>
          <TrendBadge value={stats?.trends.calls ?? 0} />
        </div>
        <div className={statCardClass}>
          <div className="text-2xl font-bold text-primary">
            {formatNumber(stats?.totalOrders ?? 0)}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Đơn hàng</div>
          <TrendBadge value={stats?.trends.orders ?? 0} />
        </div>
        <div className={statCardClass}>
          <div className="text-2xl font-bold text-primary">
            {(stats?.revenue ?? 0) / 1000000}M
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Doanh thu</div>
          <TrendBadge value={stats?.trends.revenue ?? 0} />
        </div>
        <div className={statCardClass}>
          <div className="text-2xl font-bold text-primary">{stats?.avgCallDuration}</div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">TB thời gian gọi</div>
        </div>
      </div>

      <h3 className="mb-3 text-base font-semibold">Cuộc gọi theo tuần</h3>
      <div className={cardClass}>
        <div className="flex h-[120px] items-end gap-2">
          {stats?.weeklyData.map((item) => (
            <div key={item.day} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full min-h-1 rounded bg-primary opacity-80"
                style={{ height: `${(item.calls / maxCalls) * 100}%` }}
              />
              <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.day}</span>
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
      className={[
        'mt-1 flex items-center justify-center gap-0.5 text-xs',
        isPositive ? 'text-success' : 'text-danger',
      ].join(' ')}
    >
      <Icon size={14} />
      {Math.abs(value)}%
    </div>
  );
}
