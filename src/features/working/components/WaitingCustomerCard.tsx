import {
  HiCheckCircle,
  HiClock,
  HiExclamationCircle,
  HiLocationMarker,
  HiMinusCircle,
  HiPhone,
  HiUser,
} from 'react-icons/hi';
import { CopyToClipboardButton } from '@/components/common/CopyToClipboardButton';
import {
  CALL_RESULT_OPTIONS,
  type MakeCallStatus,
} from '@/features/working/services/call.service';
import { getCallTaskStatusDisplay, type CallTask } from '@/features/working/types/call-task';

interface WaitingCustomerCardProps {
  task: CallTask;
  isSubmitting?: boolean;
  onSelectStatus: (status: MakeCallStatus) => void;
}

const statusStyles: Record<
  MakeCallStatus,
  {
    icon: typeof HiCheckCircle;
    base: string;
  }
> = {
  success: {
    icon: HiCheckCircle,
    base: 'border-success/20 bg-success/5 text-success hover:border-success/35 hover:bg-success/10',
  },
  called: {
    icon: HiPhone,
    base: 'border-warning/20 bg-warning/5 text-amber-700 hover:border-warning/35 hover:bg-warning/10 dark:text-amber-400',
  },
  recall: {
    icon: HiMinusCircle,
    base: 'border-primary/20 bg-primary/5 text-primary hover:border-primary/35 hover:bg-primary/10',
  },
  non_exist: {
    icon: HiExclamationCircle,
    base: 'border-danger/20 bg-danger/5 text-danger hover:border-danger/35 hover:bg-danger/10',
  },
};

export function WaitingCustomerCard({
  task,
  isSubmitting = false,
  onSelectStatus,
}: WaitingCustomerCardProps) {
  const statusDisplay = getCallTaskStatusDisplay(task.status);

  return (
    <div className="animate-fade-in overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-b from-primary/[0.07] via-white to-white shadow-xl dark:border-primary/20 dark:from-primary/10 dark:via-slate-800 dark:to-slate-800">
      <div className="border-b border-primary/10 px-6 py-4 dark:border-primary/15">
        <span
          className={[
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
            'bg-primary/10 text-primary dark:bg-primary/15',
          ].join(' ')}
        >
          <HiClock size={14} aria-hidden />
          {statusDisplay.label}
        </span>
      </div>

      <div className="px-6 py-6">
        <div className="flex items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <HiUser size={24} aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-50">
              {task.customerName}
            </h4>
            {task.phone && (
              <a
                href={`tel:${task.phone}`}
                className="mt-2 inline-flex items-center gap-2 text-lg font-semibold text-primary transition-colors hover:text-primary-dark"
              >
                <HiPhone size={20} aria-hidden />
                {task.phone}
              </a>
            )}
          </div>
        </div>

        {task.address && (
          <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-600 dark:bg-slate-900/50">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <HiLocationMarker size={14} aria-hidden />
              Địa chỉ
            </div>
            <div className="flex items-start gap-2">
              <p className="min-w-0 flex-1 text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
                {task.address}
              </p>
              <CopyToClipboardButton
                text={task.address!}
                successMessage="Đã sao chép địa chỉ"
                ariaLabel="Sao chép địa chỉ"
                iconSize={18}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-primary/30 hover:text-primary active:scale-[0.98] dark:border-slate-600 dark:bg-slate-800 dark:hover:border-primary/40"
              />
            </div>
          </div>
        )}

        {task.note && (
          <p className="mt-4 rounded-xl border border-amber-100 bg-amber-50/80 px-4 py-3 text-sm leading-relaxed text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
            <span className="font-semibold">Ghi chú:</span> {task.note}
          </p>
        )}
      </div>

      <div className="border-t border-primary/10 px-4 py-5 dark:border-primary/15 sm:px-6">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Kết quả gọi
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {CALL_RESULT_OPTIONS.map((option) => {
            const style = statusStyles[option.value];
            const Icon = style.icon;

            return (
              <button
                key={option.value}
                type="button"
                disabled={isSubmitting}
                onClick={() => onSelectStatus(option.value)}
                className={[
                  'flex min-h-[4.25rem] flex-col items-center justify-center gap-1.5 rounded-xl border-2 px-2 py-3 text-center text-xs font-semibold transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-[4.75rem] sm:text-sm',
                  style.base,
                ].join(' ')}
              >
                <Icon size={22} aria-hidden />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function WaitingCustomerEmpty() {
  return (
    <div className="animate-fade-in rounded-3xl border border-slate-100 bg-white px-6 py-14 text-center shadow-xl dark:border-slate-700 dark:bg-slate-800">
      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
        <HiClock size={32} aria-hidden />
      </div>
      <p className="text-base font-semibold text-slate-800 dark:text-slate-100">
        Không còn khách hàng chờ gọi
      </p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Hàng đợi trống. Bạn có thể xem các tab khác.
      </p>
    </div>
  );
}

export function WaitingCustomerSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
      <div className="skeleton-shimmer h-14 border-b border-slate-100 dark:border-slate-700" />
      <div className="space-y-4 px-6 py-6">
        <div className="flex gap-3">
          <div className="skeleton-shimmer size-12 shrink-0 rounded-2xl" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="skeleton-shimmer h-7 w-3/4 rounded-lg" />
            <div className="skeleton-shimmer h-5 w-1/2 rounded-lg" />
          </div>
        </div>
        <div className="skeleton-shimmer h-24 rounded-2xl" />
      </div>
      <div className="border-t border-slate-100 px-4 py-5 dark:border-slate-700 sm:px-6">
        <div className="grid grid-cols-2 gap-2.5">
          <div className="skeleton-shimmer col-span-2 h-4 w-24 justify-self-center rounded-lg" />
          <div className="skeleton-shimmer h-[4.25rem] rounded-xl sm:h-[4.75rem]" />
          <div className="skeleton-shimmer h-[4.25rem] rounded-xl sm:h-[4.75rem]" />
          <div className="skeleton-shimmer h-[4.25rem] rounded-xl sm:h-[4.75rem]" />
          <div className="skeleton-shimmer h-[4.25rem] rounded-xl sm:h-[4.75rem]" />
        </div>
      </div>
    </div>
  );
}
