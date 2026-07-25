import {
  HiCheckCircle,
  HiExclamationCircle,
  HiPhone,
  HiUserGroup,
  HiXCircle,
} from 'react-icons/hi';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { formatNumber } from '@/utils';
import {
  getBatchProgressPercent,
  getBatchSuccessRate,
  type ImportBatchStats,
} from '@/features/statistics/services/my-import-batch-stats.service';

interface ImportBatchStatsDetailModalProps {
  open: boolean;
  stats: ImportBatchStats | null;
  onClose: () => void;
}

const metricCards = [
  {
    key: 'total_customers',
    label: 'Tổng khách hàng',
    icon: HiUserGroup,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  // {
  //   key: 'assigned_count',
  //   label: 'Đã phân',
  //   icon: HiUserGroup,
  //   color: 'text-sky-600 dark:text-sky-400',
  //   bg: 'bg-sky-500/10',
  // },
  {
    key: 'available_count',
    label: 'Khả dụng',
    icon: HiPhone,
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    key: 'called_count',
    label: 'Đã gọi',
    icon: HiPhone,
    color: 'text-slate-600 dark:text-slate-300',
    bg: 'bg-slate-500/10',
  },
  {
    key: 'rejected_count',
    label: 'Từ chối',
    icon: HiXCircle,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-500/10',
  },
  {
    key: 'success_count',
    label: 'Thành công',
    icon: HiCheckCircle,
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    key: 'non_exist_count',
    label: 'Data lỗi',
    icon: HiExclamationCircle,
    color: 'text-danger',
    bg: 'bg-danger/10',
  },
] as const;

export function ImportBatchStatsDetailModal({
  open,
  stats,
  onClose,
}: ImportBatchStatsDetailModalProps) {
  if (!stats) return null;

  const successRate = getBatchSuccessRate(stats);
  const progress = getBatchProgressPercent(stats);

  return (
    <Modal open={open} title={stats.title} onClose={onClose}>
      <div className="mb-4 rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-4 dark:from-primary/25 dark:via-primary/10">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Gói #{stats.id}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <div className="text-2xl font-bold text-primary">{successRate}%</div>
            <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Tỷ lệ chốt</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {progress}%
            </div>
            <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Tiến độ xử lý</div>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/70 dark:bg-slate-900/40">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          const value = stats[metric.key];

          return (
            <div
              key={metric.key}
              className="rounded-xl border border-slate-200 p-3 dark:border-slate-700"
            >
              <div className={`mb-2 inline-flex rounded-lg p-1.5 ${metric.bg}`}>
                <Icon className={`text-lg ${metric.color}`} />
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {formatNumber(value)}
              </div>
              <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {metric.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5">
        <Button type="button" variant="secondary" onClick={onClose}>
          Đóng
        </Button>
      </div>
    </Modal>
  );
}
