import { useMemo, useState } from 'react';
import {
  HiCheckCircle,
  HiChevronLeft,
  HiChevronRight,
  // HiPhone,
  HiTrendingUp,
  HiUserGroup,
} from 'react-icons/hi';
import { Button } from '@/components/ui/Button';
import { SkeletonList } from '@/components/ui/Skeleton';
import { ImportBatchStatsDetailModal } from '@/features/statistics/components/ImportBatchStatsDetailModal';
import { useMyImportBatchStats } from '@/features/statistics/hooks/useMyImportBatchStats';
import {
  DEFAULT_BATCH_STATS_PER_PAGE,
  getBatchSuccessRate,
  type ImportBatchStats,
} from '@/features/statistics/services/my-import-batch-stats.service';
import { formatNumber } from '@/utils';

const cardClass =
  'rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800';

const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 transition-colors duration-150 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100';

function SummaryCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof HiUserGroup;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className={`${cardClass} p-4`}>
      <div className={`mb-2 inline-flex rounded-xl p-2 ${accent}`}>
        <Icon className="text-xl" />
      </div>
      <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{value}</div>
      <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  );
}

export function StatsByPackagePage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_BATCH_STATS_PER_PAGE);
  const [selectedStats, setSelectedStats] = useState<ImportBatchStats | null>(null);

  const { data, isLoading, isFetching, isError } = useMyImportBatchStats({
    page,
    perPage,
    limit: perPage,
  });

  const batches = data?.data ?? [];
  const meta = data?.meta;
  const currentPage = meta?.current_page ?? page;
  const lastPage = meta?.last_page ?? 1;
  const total = meta?.total ?? 0;
  const isBusy = isLoading || (isFetching && batches.length === 0);

  const summary = useMemo(() => {
    return batches.reduce(
      (acc, item) => {
        acc.totalCustomers += item.total_customers;
        acc.assigned += item.assigned_count;
        acc.success += item.success_count;
        acc.called += item.called_count;
        return acc;
      },
      { totalCustomers: 0, assigned: 0, success: 0, called: 0 },
    );
  }, [batches]);

  const overallSuccessRate =
    summary.called > 0 ? Math.round((summary.success / summary.called) * 100) : 0;

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setPage(1);
  };

  return (
    <>
      <div className={`${cardClass} mb-4 overflow-hidden p-0`}>
        <div className="bg-gradient-to-br from-primary via-primary to-primary-dark px-4 py-3 text-white">
          <p className="text-sm text-white/80 text-center">Theo dõi hiệu suất từng gói đã phân</p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <SummaryCard
          icon={HiUserGroup}
          label="Tổng KH (trang)"
          value={formatNumber(summary.totalCustomers)}
          accent="bg-primary/10 text-primary"
        />
        {/* <SummaryCard
          icon={HiPhone}
          label="Đã phân"
          value={formatNumber(summary.assigned)}
          accent="bg-sky-500/10 text-sky-600 dark:text-sky-400"
        /> */}
        <SummaryCard
          icon={HiCheckCircle}
          label="Thành công"
          value={formatNumber(summary.success)}
          accent="bg-success/10 text-success"
        />
        <SummaryCard
          icon={HiTrendingUp}
          label="Tỷ lệ chốt"
          value={`${overallSuccessRate}%`}
          accent="bg-warning/10 text-warning"
        />
      </div>

      <div className={`${cardClass} mb-3 p-4`}>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label htmlFor="batch-stats-per-page" className="mb-1.5 block text-sm font-medium">
              Mỗi trang
            </label>
            <select
              id="batch-stats-per-page"
              value={perPage}
              onChange={(event) => handlePerPageChange(Number(event.target.value))}
              className={inputClassName}
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <p className="pb-2.5 text-xs text-slate-500 dark:text-slate-400">
            {formatNumber(total)} gói
          </p>
        </div>
      </div>

      {isError && (
        <div className={`${cardClass} mb-3 p-4 text-sm text-danger`}>
          Không thể tải thống kê gói data. Vui lòng thử lại.
        </div>
      )}

      {isBusy ? (
        <SkeletonList count={3} />
      ) : batches.length === 0 ? (
        <div
          className={`${cardClass} p-6 text-center text-sm text-slate-500 dark:text-slate-400`}
        >
          Chưa có gói data nào được phân cho bạn.
        </div>
      ) : (
        <div className={`${cardClass} overflow-hidden p-0`}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
                <tr>
                  <th className="whitespace-nowrap px-3 py-3 font-medium">#</th>
                  <th className="whitespace-nowrap px-3 py-3 font-medium">Tên gói</th>
                  <th className="whitespace-nowrap px-3 py-3 font-medium">Tổng KH</th>
                  <th className="whitespace-nowrap px-3 py-3 font-medium">Đã phân</th>
                  <th className="whitespace-nowrap px-3 py-3 font-medium">Khả dụng</th>
                  <th className="whitespace-nowrap px-3 py-3 font-medium">Đã gọi</th>
                  <th className="whitespace-nowrap px-3 py-3 font-medium">Thành công</th>
                  <th className="whitespace-nowrap px-3 py-3 font-medium">Tỷ lệ</th>
                  <th className="whitespace-nowrap px-3 py-3 font-medium">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch, index) => {
                  const successRate = getBatchSuccessRate(batch);

                  return (
                    <tr
                      key={batch.id}
                      className="border-b border-slate-100 last:border-b-0 dark:border-slate-700/70"
                    >
                      <td className="whitespace-nowrap px-3 py-3 text-slate-500 dark:text-slate-400">
                        {(currentPage - 1) * perPage + index + 1}
                      </td>
                      <td className="max-w-[160px] px-3 py-3">
                        <div className="truncate font-medium text-slate-900 dark:text-slate-100">
                          {batch.title}
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-400">#{batch.id}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {formatNumber(batch.total_customers)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {formatNumber(batch.assigned_count)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-warning">
                        {formatNumber(batch.available_count)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {formatNumber(batch.called_count)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-success">
                        {formatNumber(batch.success_count)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <span className="inline-flex rounded-lg bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                          {successRate}%
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="min-h-8 min-w-0 px-3 py-1.5 text-xs"
                          onClick={() => setSelectedStats(batch)}
                        >
                          Chi tiết
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-slate-200 px-3 py-3 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatNumber(total)} gói · Trang {currentPage}/{lastPage}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Trang trước"
                disabled={currentPage <= 1 || isFetching}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="inline-flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors enabled:active:bg-slate-100 disabled:opacity-40 dark:border-slate-600 dark:text-slate-300 dark:enabled:active:bg-slate-700"
              >
                <HiChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Trang sau"
                disabled={currentPage >= lastPage || isFetching}
                onClick={() => setPage((prev) => Math.min(lastPage, prev + 1))}
                className="inline-flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors enabled:active:bg-slate-100 disabled:opacity-40 dark:border-slate-600 dark:text-slate-300 dark:enabled:active:bg-slate-700"
              >
                <HiChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <ImportBatchStatsDetailModal
        open={selectedStats !== null}
        stats={selectedStats}
        onClose={() => setSelectedStats(null)}
      />
    </>
  );
}
