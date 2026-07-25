import { useState } from 'react';
import dayjs from 'dayjs';
import { HiChevronLeft, HiChevronRight, HiClipboardCopy, HiLocationMarker } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';
import { SkeletonList } from '@/components/ui/Skeleton';
import { useCustomerHistory } from '@/features/statistics/hooks/useCustomerHistory';
import {
  CUSTOMER_HISTORY_STATUS_ALL,
  CUSTOMER_HISTORY_STATUS_OPTIONS,
  DEFAULT_CUSTOMER_HISTORY_PER_PAGE,
  getCustomerHistoryStatusDisplay,
  type CustomerHistoryStatus,
} from '@/features/statistics/services/customer-history.service';
import { formatNumber } from '@/utils';

const cardClass =
  'rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800';

const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 transition-colors duration-150 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100';

async function copyText(text: string, successMessage: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMessage);
  } catch {
    toast.error('Không thể sao chép');
  }
}

function truncateAddress(address: string, max = 60) {
  return address.length > max ? `${address.slice(0, max)}...` : address;
}

export function CustomerHistoryPage() {
  const [status, setStatus] = useState<CustomerHistoryStatus>(CUSTOMER_HISTORY_STATUS_ALL);
  const [nameInput, setNameInput] = useState('');
  const [name, setName] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError } = useCustomerHistory({
    isAvailable: status || undefined,
    name: name || undefined,
    page,
    perPage: DEFAULT_CUSTOMER_HISTORY_PER_PAGE,
  });

  const customers = data?.data ?? [];
  const meta = data?.meta;
  const currentPage = meta?.current_page ?? page;
  const lastPage = meta?.last_page ?? 1;
  const total = meta?.total ?? 0;
  const isBusy = isLoading || (isFetching && customers.length === 0);

  const handleStatusChange = (nextStatus: CustomerHistoryStatus) => {
    setStatus(nextStatus);
    setPage(1);
  };

  const handleApplyNameFilter = () => {
    setName(nameInput.trim());
    setPage(1);
  };

  return (
    <>
      <div className={`${cardClass} mb-4 overflow-hidden p-0`}>
        <div className="bg-gradient-to-br from-primary via-primary to-primary-dark px-4 py-3 text-white">
          <p className="text-sm text-white/80">Danh sách khách hàng đã/đang xử lý</p>
        </div>
      </div>

      <div className={`${cardClass} mb-4 space-y-3 p-4`}>
        <div>
          <label htmlFor="customer-history-status" className="mb-1.5 block text-sm font-medium">
            Trạng thái
          </label>
          <select
            id="customer-history-status"
            value={status}
            onChange={(event) =>
              handleStatusChange(event.target.value as CustomerHistoryStatus)
            }
            className={inputClassName}
          >
            {CUSTOMER_HISTORY_STATUS_OPTIONS.map((option) => (
              <option key={option.value || 'all'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="customer-history-name" className="mb-1.5 block text-sm font-medium">
            Tên khách hàng
          </label>
          <div className="flex items-end gap-3">
            <input
              id="customer-history-name"
              type="search"
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleApplyNameFilter();
                }
              }}
              placeholder="Nhập tên khách hàng..."
              className={inputClassName}
            />
            <Button
              type="button"
              size="sm"
              className="w-auto shrink-0 px-5"
              onClick={handleApplyNameFilter}
            >
              Lọc
            </Button>
          </div>
        </div>
      </div>

      {isError && (
        <div className={`${cardClass} mb-3 p-4 text-sm text-danger`}>
          Không thể tải lịch sử khách hàng. Vui lòng thử lại.
        </div>
      )}

      {isBusy ? (
        <SkeletonList count={4} />
      ) : customers.length === 0 ? (
        <div className={`${cardClass} p-6 text-center text-sm text-slate-500 dark:text-slate-400`}>
          Không có khách hàng phù hợp bộ lọc.
        </div>
      ) : (
        <div className="space-y-3">
          {customers.map((customer) => {
            const statusDisplay = getCustomerHistoryStatusDisplay(customer.is_available);
            const batchTitle = customer.import_batch?.title;

            return (
              <article key={customer.id} className={`${cardClass} p-4`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[15px] font-semibold text-slate-900 dark:text-slate-100">
                      {customer.name}
                      {customer.phone && (
                        <span className="font-normal text-sm text-slate-500 dark:text-slate-400">
                          {' '}
                          - {customer.phone}
                        </span>
                      )}
                    </h3>
                    {customer.email && (
                      <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                        {customer.email}
                      </p>
                    )}
                  </div>
                  <span
                    className={`shrink-0 rounded-lg px-2 py-1 text-[11px] font-semibold ${statusDisplay.className}`}
                  >
                    {statusDisplay.label}
                  </span>
                </div>

                {customer.address && (
                  <div className="mt-2 flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <HiLocationMarker className="mt-0.5 shrink-0 text-sm" />
                    <span className="min-w-0 flex-1" title={customer.address}>
                      {truncateAddress(customer.address)}
                    </span>
                    <button
                      type="button"
                      aria-label="Sao chép địa chỉ"
                      onClick={() => copyText(customer.address!, 'Đã sao chép địa chỉ')}
                      className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary active:bg-slate-200 dark:hover:bg-slate-700 dark:hover:text-primary dark:active:bg-slate-600"
                    >
                      <HiClipboardCopy size={16} />
                    </button>
                  </div>
                )}

                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  {batchTitle && (
                    <span className="rounded-md bg-slate-100 px-2 py-1 dark:bg-slate-700">
                      {batchTitle}
                    </span>
                  )}
                  <span>
                    Cập nhật:{' '}
                    {customer.updated_at
                      ? dayjs(customer.updated_at).format('DD/MM/YYYY HH:mm')
                      : '—'}
                  </span>
                </div>
              </article>
            );
          })}

          <div className={`${cardClass} flex items-center justify-between gap-2 p-3`}>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatNumber(total)} KH · Trang {currentPage}/{lastPage}
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
    </>
  );
}
