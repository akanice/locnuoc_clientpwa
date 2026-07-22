import dayjs from 'dayjs';
import { Modal } from '@/components/ui/Modal';
import type { MyOrder } from '@/features/statistics/services/my-orders.service';
import {
  getOrderCustomerName,
  getOrderPhone,
  getOrderStatusLabel,
} from '@/features/statistics/services/my-orders.service';

interface OrderDetailModalProps {
  open: boolean;
  order: MyOrder | null;
  onClose: () => void;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-3 last:border-b-0 dark:border-slate-700">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="text-sm text-slate-900 dark:text-slate-100">{value}</dd>
    </div>
  );
}

export function OrderDetailModal({ open, order, onClose }: OrderDetailModalProps) {
  if (!order) return null;

  const note = order.note?.trim();

  return (
    <Modal open={open} title="Chi tiết đơn hàng" onClose={onClose}>
      <dl>
        <DetailRow label="Mã đơn" value={String(order.id)} />
        <DetailRow label="Khách hàng" value={getOrderCustomerName(order)} />
        <DetailRow label="Số điện thoại" value={getOrderPhone(order)} />
        <DetailRow label="Trạng thái" value={getOrderStatusLabel(order.status)} />
        <DetailRow label="Ghi chú" value={note || '—'} />
        <DetailRow
          label="Ngày tạo"
          value={
            order.created_at
              ? dayjs(order.created_at).format('DD/MM/YYYY HH:mm')
              : '—'
          }
        />
        <DetailRow
          label="Cập nhật lần cuối"
          value={
            order.updated_at
              ? dayjs(order.updated_at).format('DD/MM/YYYY HH:mm')
              : '—'
          }
        />
      </dl>
    </Modal>
  );
}
