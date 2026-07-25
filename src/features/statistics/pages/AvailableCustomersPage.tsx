const cardClass =
  'rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl dark:border-slate-700 dark:bg-slate-800';

export function AvailableCustomersPage() {
  return (
    <div className={cardClass}>
      <h2 className="text-base font-semibold">Khách hàng khả dụng</h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Nội dung đang được cập nhật.
      </p>
    </div>
  );
}
