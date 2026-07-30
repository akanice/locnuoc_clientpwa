import {
  HiClipboardCopy,
  HiClock,
  HiLocationMarker,
  HiPhone,
  HiUser,
} from 'react-icons/hi';
import { Button } from '@/components/ui/Button';
import { getCallTaskStatusDisplay, type CallTask } from '@/features/working/types/call-task';

interface WaitingCustomerCardProps {
  task: CallTask;
  isCalling: boolean;
  onCall: (task: CallTask) => void;
  onCopyAddress: (text: string) => void;
}

export function WaitingCustomerCard({
  task,
  isCalling,
  onCall,
  onCopyAddress,
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
              <button
                type="button"
                aria-label="Sao chép địa chỉ"
                onClick={() => onCopyAddress(task.address!)}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-primary/30 hover:text-primary active:scale-[0.98] dark:border-slate-600 dark:bg-slate-800 dark:hover:border-primary/40"
              >
                <HiClipboardCopy size={18} />
              </button>
            </div>
          </div>
        )}

        {task.note && (
          <p className="mt-4 rounded-xl border border-amber-100 bg-amber-50/80 px-4 py-3 text-sm leading-relaxed text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
            <span className="font-semibold">Ghi chú:</span> {task.note}
          </p>
        )}
      </div>

      <div className="flex justify-center border-t border-primary/10 px-6 py-6 dark:border-primary/15">
        <Button
          variant="primary"
          loading={isCalling}
          onClick={() => onCall(task)}
          className="min-h-[3.75rem] w-auto min-w-[12rem] rounded-2xl px-10 py-4 text-base shadow-lg shadow-primary/25 ring-4 ring-primary/10 transition-transform active:scale-[0.98]"
        >
          <HiPhone size={24} aria-hidden />
          Gọi ngay
        </Button>
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
      <div className="border-t border-slate-100 px-6 py-6 dark:border-slate-700">
        <div className="skeleton-shimmer mx-auto h-14 max-w-xs rounded-2xl" />
      </div>
    </div>
  );
}
