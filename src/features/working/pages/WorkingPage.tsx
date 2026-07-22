import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  HiClock,
  HiExclamationCircle,
  HiPhone,
} from 'react-icons/hi';
import { SkeletonList } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { CallResultModal } from '@/features/working/components/CallResultModal';
import { useMyCustomers } from '@/features/working/hooks/useMyCustomers';
import {
  MAKE_CALL_STATUS_SUCCESS,
  type MakeCallStatus,
} from '@/features/working/services/call.service';
import {
  buildMyCustomersQueryParams,
  CUSTOMER_TAB_OPTIONS,
  CUSTOMER_TAB_WAITING,
  type CustomerTab,
  type MyCustomersParams,
} from '@/features/working/services/customer.service';
import {
  MY_CUSTOMERS_QUERY_KEY,
  getCallTaskStatusDisplay,
  isCallTaskCallable,
  type CallTask,
} from '@/features/working/types/call-task';

const cardClass =
  'rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-xl dark:border-slate-700 dark:bg-slate-800';
const statCardClass =
  'rounded-2xl border border-slate-100 bg-white px-4 py-3 text-center shadow-xl dark:border-slate-700 dark:bg-slate-800';

const statusIcons = {
  called: HiPhone,
  non_exist: HiExclamationCircle,
  available: HiClock,
  just_upload: HiClock,
} as const;

const statusIconColors = {
  called: 'text-danger',
  non_exist: 'text-danger',
  available: 'text-warning',
  just_upload: 'text-warning',
} as const;

interface CallModalState {
  customerId: number;
  customerName: string;
}

function getCachedTabCount(
  queryClient: ReturnType<typeof useQueryClient>,
  tab: CustomerTab,
) {
  return (
    queryClient.getQueryData<CallTask[]>([
      ...MY_CUSTOMERS_QUERY_KEY,
      buildMyCustomersQueryParams(tab),
    ])?.length ?? 0
  );
}

export function WorkingPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<CustomerTab>(CUSTOMER_TAB_WAITING);
  const [loadedTabs, setLoadedTabs] = useState<Set<CustomerTab>>(
    () => new Set([CUSTOMER_TAB_WAITING]),
  );
  const [activeCall, setActiveCall] = useState<number | null>(null);
  const [callModal, setCallModal] = useState<CallModalState | null>(null);
  const [reloadTabsOnSelect, setReloadTabsOnSelect] = useState(false);

  const queryParams: MyCustomersParams = buildMyCustomersQueryParams(activeTab);
  const {
    data: tasks = [],
    isLoading,
    isFetching,
    isError,
  } = useMyCustomers(queryParams, {
    enabled: loadedTabs.has(activeTab),
  });

  const reloadTab = (tab: CustomerTab) => {
    void queryClient.invalidateQueries({
      queryKey: [...MY_CUSTOMERS_QUERY_KEY, buildMyCustomersQueryParams(tab)],
    });
  };

  const handleTabChange = (tab: CustomerTab) => {
    setActiveTab(tab);
    setLoadedTabs((prev) => new Set(prev).add(tab));

    if (reloadTabsOnSelect) {
      reloadTab(tab);
    }
  };

  const handleCallSaved = (status: MakeCallStatus) => {
    if (status !== MAKE_CALL_STATUS_SUCCESS) return;

    setReloadTabsOnSelect(true);
    queryClient.removeQueries({ queryKey: MY_CUSTOMERS_QUERY_KEY });
    setLoadedTabs(new Set([activeTab]));
    reloadTab(activeTab);
  };

  const pendingCount =
    activeTab === CUSTOMER_TAB_WAITING
      ? tasks.length
      : getCachedTabCount(queryClient, CUSTOMER_TAB_WAITING);
  const calledCount = CUSTOMER_TAB_OPTIONS.filter(
    (option) => option.value !== CUSTOMER_TAB_WAITING,
  ).reduce((sum, option) => sum + getCachedTabCount(queryClient, option.value), 0);

  const isTabLoading = isLoading || (isFetching && tasks.length === 0);

  const handleCall = (task: CallTask) => {
    setActiveCall(task.id);
    window.location.href = `tel:${task.phone}`;
    setTimeout(() => {
      setActiveCall(null);
      setCallModal({ customerId: task.id, customerName: task.customerName });
    }, 2000);
  };

  return (
    <>
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className={statCardClass}>
          <div className="text-2xl font-bold text-primary">{pendingCount}</div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Chờ gọi</div>
        </div>
        <div className={statCardClass}>
          <div className="text-2xl font-bold text-primary">{calledCount}</div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Đã gọi</div>
        </div>
      </div>

      <h3 className="mb-3 text-base font-semibold">Danh sách khách hàng</h3>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CUSTOMER_TAB_OPTIONS.map((option) => {
          const isActive = activeTab === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleTabChange(option.value)}
              className={[
                'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-white shadow-xl'
                  : 'bg-slate-100 text-slate-600 active:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:active:bg-slate-600',
              ].join(' ')}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {isError && (
        <div className={`${cardClass} mb-3 text-sm text-danger`}>
          Không thể tải danh sách khách hàng. Vui lòng thử lại.
        </div>
      )}

      {isTabLoading ? (
        <SkeletonList count={3} />
      ) : tasks.length === 0 ? (
        <div className={`${cardClass} text-center text-sm text-slate-500 dark:text-slate-400`}>
          Không có khách hàng trong tab này.
        </div>
      ) : (
        tasks.map((task) => {
          const statusDisplay = getCallTaskStatusDisplay(task.status);
          const statusKey = task.status as keyof typeof statusIcons;
          const StatusIcon =
            !isCallTaskCallable(task.status) && task.status !== 'calling'
              ? statusIcons[statusKey]
              : null;

          return (
            <div key={task.id} className={`${cardClass} mb-3 flex items-center gap-3`}>
              <div className="flex-1">
                <div className="text-[15px] font-semibold">
                  {task.customerName}
                  {task.phone && (
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {' '}
                      - {task.phone}
                    </span>
                  )}
                </div>
                <div className={`mt-1 text-xs ${statusDisplay.className}`}>
                  {statusDisplay.label}
                </div>
                {task.note && (
                  <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {task.note}
                  </div>
                )}
              </div>
              {isCallTaskCallable(task.status) && (
                <Button
                  variant="primary"
                  size="sm"
                  loading={activeCall === task.id}
                  onClick={() => handleCall(task)}
                  className="w-auto min-w-12"
                >
                  <HiPhone size={20} />
                </Button>
              )}
              {StatusIcon && (
                <StatusIcon size={24} className={statusIconColors[statusKey] ?? 'text-slate-500'} />
              )}
            </div>
          );
        })
      )}

      <CallResultModal
        open={callModal !== null}
        customerId={callModal?.customerId ?? 0}
        customerName={callModal?.customerName ?? ''}
        onClose={() => setCallModal(null)}
        onSaved={handleCallSaved}
      />
    </>
  );
}
