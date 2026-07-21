import { useState } from 'react';
import dayjs from 'dayjs';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { Button } from '@/components/ui/Button';
import { SkeletonList } from '@/components/ui/Skeleton';
import { useMyOrders } from '@/features/statistics/hooks/useMyOrders';
import {
  DEFAULT_ORDERS_PER_PAGE,
  getOrderCustomerName,
  getOrderPhone,
  getOrderStatusLabel,
} from '@/features/statistics/services/my-orders.service';

const cardClass =
  'rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-800';

const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 transition-colors duration-150 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100';

function getDefaultFromDate() {
  return dayjs().startOf('month').format('YYYY-MM-DD');
}

function getDefaultToDate() {
  return dayjs().format('YYYY-MM-DD');
}

export function MyOrdersSection() {
  const [fromDateInput, setFromDateInput] = useState(getDefaultFromDate);
  const [toDateInput, setToDateInput] = useState(getDefaultToDate);
  const [fromDate, setFromDate] = useState(getDefaultFromDate);
  const [toDate, setToDate] = useState(getDefaultToDate);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_ORDERS_PER_PAGE);

  const { data, isLoading, isFetching, isError } = useMyOrders({
    fromDate,
    toDate,
    page,
    perPage,
  });

  const orders = data?.data ?? [];
  const meta = data?.meta;
  const currentPage = meta?.current_page ?? page;
  const lastPage = meta?.last_page ?? 1;
  const total = meta?.total ?? 0;
  const isBusy = isLoading || (isFetching && orders.length === 0);

  const handleApplyFilter = () => {
    const nextFrom = fromDateInput || getDefaultFromDate();
    const nextTo = toDateInput || getDefaultToDate();

    setFromDate(nextFrom);
    setToDate(nextTo);
    setPage(1);
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setPage(1);
  };

  return (
    <section className="mt-6">
      <h3 className="mb-3 text-base font-semibold">Đơn hàng của tôi</h3>

      <div className={`${cardClass} mb-3`}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="orders-from-date" className="mb-1.5 block text-sm font-medium">
              Từ ngày
            </label>
            <input
              id="orders-from-date"
              type="date"
              value={fromDateInput}
              onChange={(event) => setFromDateInput(event.target.value)}
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="orders-to-date" className="mb-1.5 block text-sm font-medium">
              Đến ngày
            </label>
            <input
              id="orders-to-date"
              type="date"
              value={toDateInput}
              onChange={(event) => setToDateInput(event.target.value)}
              className={inputClassName}
            />
          </div>
        </div>

        <div className="mt-3 flex items-end gap-3">
          <div className="flex-1">
            <label htmlFor="orders-per-page" className="mb-1.5 block text-sm font-medium">
              Mỗi trang
            </label>
            <select
              id="orders-per-page"
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
          <Button size="sm" className="w-auto shrink-0 px-5" onClick={handleApplyFilter}>
            Lọc
          </Button>
        </div>
      </div>

      {isError && (
        <div className={`${cardClass} mb-3 text-sm text-danger`}>
          Không thể tải danh sách đơn hàng. Vui lòng thử lại.
        </div>
      )}

      {isBusy ? (
        <SkeletonList count={3} />
      ) : orders.length === 0 ? (
        <div className={`${cardClass} text-center text-sm text-slate-500 dark:text-slate-400`}>
          Không có đơn hàng trong khoảng thời gian này.
        </div>
      ) : (
        <div className={`${cardClass} overflow-hidden p-0`}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
                <tr>
                  <th className="whitespace-nowrap px-3 py-3 font-medium">#</th>
                  <th className="whitespace-nowrap px-3 py-3 font-medium">Khách hàng</th>
                  <th className="whitespace-nowrap px-3 py-3 font-medium">SĐT</th>
                  <th className="whitespace-nowrap px-3 py-3 font-medium">Trạng thái</th>
                  <th className="whitespace-nowrap px-3 py-3 font-medium">Ghi chú</th>
                  <th className="whitespace-nowrap px-3 py-3 font-medium">Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={order.id}
                    className="border-b border-slate-100 last:border-b-0 dark:border-slate-700/70"
                  >
                    <td className="whitespace-nowrap px-3 py-3 text-slate-500 dark:text-slate-400">
                      {(currentPage - 1) * perPage + index + 1}
                    </td>
                    <td className="max-w-[140px] truncate px-3 py-3 font-medium">
                      {getOrderCustomerName(order)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-600 dark:text-slate-300">
                      {getOrderPhone(order)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {getOrderStatusLabel(order.status)}
                    </td>
                    <td className="max-w-[160px] truncate px-3 py-3 text-slate-500 dark:text-slate-400">
                      {order.note?.trim() || '—'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-500 dark:text-slate-400">
                      {order.created_at
                        ? dayjs(order.created_at).format('DD/MM/YYYY HH:mm')
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-slate-200 px-3 py-3 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {total} đơn · Trang {currentPage}/{lastPage}
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
    </section>
  );
}
