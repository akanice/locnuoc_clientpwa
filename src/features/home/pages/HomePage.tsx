import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { HiPhone, HiCheckCircle, HiClock } from 'react-icons/hi';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { useAuthStore, selectUser } from '@/stores/auth.store';
import { formatNumber } from '@/utils';

dayjs.locale('vi');

const cardClass =
  'rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-800';
const statCardClass =
  'rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-xl dark:border-slate-700 dark:bg-slate-800';

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
      <div className={`${cardClass} mb-4`}>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {dayjs().format('dddd, DD/MM/YYYY')}
        </p>
        <h2 className="mt-1 text-xl font-semibold">
          Xin chào, {user?.name?.split(' ').pop()}! 👋
        </h2>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className={statCardClass}>
          <HiPhone className="mx-auto mb-2 text-2xl text-primary" />
          <div className="text-2xl font-bold text-primary">
            {formatNumber(stats?.todayCalls ?? 0)}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Cuộc gọi hôm nay</div>
        </div>
        <div className={statCardClass}>
          <HiCheckCircle className="mx-auto mb-2 text-2xl text-success" />
          <div className="text-2xl font-bold text-primary">
            {formatNumber(stats?.completedCalls ?? 0)}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Hoàn thành</div>
        </div>
        <div className={statCardClass}>
          <HiClock className="mx-auto mb-2 text-2xl text-warning" />
          <div className="text-2xl font-bold text-primary">
            {formatNumber(stats?.pendingCalls ?? 0)}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Đang chờ</div>
        </div>
        <div className={statCardClass}>
          <div className="text-2xl font-bold text-primary">{stats?.conversionRate ?? 0}%</div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Tỷ lệ chốt</div>
        </div>
      </div>

      <h3 className="mb-3 text-base font-semibold">Hoạt động gần đây</h3>
      <div className={cardClass}>
        <p className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">
          Chưa có hoạt động nào hôm nay. Bắt đầu gọi điện tại tab Working!
        </p>
      </div>
    </>
  );
}
