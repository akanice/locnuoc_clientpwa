// import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { Link } from 'react-router-dom';
import {
  HiPhone,
  HiChartBar,
  HiUser,
  HiChevronRight,
  // HiCheckCircle,
  // HiClock,
  // HiTrendingUp,
} from 'react-icons/hi';
// import { PageSkeleton } from '@/components/ui/Skeleton';
import { useAuthStore, selectUser } from '@/stores/auth.store';
import { ROUTES } from '@/constants';
// import { formatNumber } from '@/utils';

dayjs.locale('vi');

const cardClass =
  'rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-800';
// const statCardClass =
//   'rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-xl dark:border-slate-700 dark:bg-slate-800';

const shortcuts = [
  {
    to: ROUTES.WORKING,
    label: 'Gọi điện',
    description: 'Bắt đầu gọi điện',
    icon: HiPhone,
    iconWrap:
      'bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/30',
    accent: 'group-hover:border-primary/40 group-active:border-primary/50',
  },
  {
    to: ROUTES.STATISTICS,
    label: 'Thống kê',
    description: 'Xem thống kê gọi điện',
    icon: HiChartBar,
    iconWrap:
      'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30',
    accent: 'group-hover:border-emerald-500/40 group-active:border-emerald-500/50',
  },
  {
    to: ROUTES.PROFILE,
    label: 'Cá nhân',
    description: 'Tài khoản & cài đặt',
    icon: HiUser,
    iconWrap:
      'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-500/30',
    accent: 'group-hover:border-amber-500/40 group-active:border-amber-500/50',
  },
] as const;

export function HomePage() {
  const user = useAuthStore(selectUser);

  // const { data: stats, isLoading } = useQuery({
  //   queryKey: ['dashboard-stats'],
  //   queryFn: async () => ({
  //     todayCalls: 24,
  //     completedCalls: 18,
  //     pendingCalls: 6,
  //     conversionRate: 75,
  //   }),
  //   staleTime: 1000 * 60 * 2,
  // });

  // if (isLoading) return <PageSkeleton />;

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

      {/* <div className="mb-4 grid grid-cols-2 gap-3">
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
          <HiTrendingUp className="mx-auto mb-2 text-2xl text-primary" />
          <div className="text-2xl font-bold text-primary">{stats?.conversionRate ?? 0}%</div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Tỷ lệ chốt</div>
        </div>
      </div> */}

      <h3 className="mb-3 text-base font-semibold">Truy cập nhanh</h3>
      <div className="mb-5 flex flex-col gap-3">
        {shortcuts.map(({ to, label, description, icon: Icon, iconWrap, accent }) => (
          <Link
            key={to}
            to={to}
            className={[
              'group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-slate-200',
              'bg-white p-3.5 shadow-xl transition-all duration-200',
              'hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 active:scale-[0.98]',
              'dark:border-slate-700 dark:bg-slate-800',
              accent,
            ].join(' ')}
          >
            <div
              className={[
                'flex size-12 shrink-0 items-center justify-center rounded-2xl',
                'transition-transform duration-200 group-hover:scale-105 group-active:scale-95',
                iconWrap,
              ].join(' ')}
            >
              <Icon className="text-2xl" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-semibold text-slate-900 dark:text-slate-100">
                {label}
              </div>
              <div className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                {description}
              </div>
            </div>
            <HiChevronRight
              className="size-5 shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-slate-500 dark:text-slate-600 dark:group-hover:text-slate-400"
              aria-hidden
            />
          </Link>
        ))}
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
