import type { OrderStatus } from '@/features/working/services/order.service';
import { ORDER_STATUS_OPTIONS, STATUS_PENDING } from '@/features/working/services/order.service';

export const MY_CUSTOMERS_QUERY_KEY = ['my-customers'] as const;
/** @deprecated Use MY_CUSTOMERS_QUERY_KEY with status instead */
export const CALL_TASKS_QUERY_KEY = MY_CUSTOMERS_QUERY_KEY;

export type CallTaskStatus = 'calling' | OrderStatus;

export interface CallTask {
  id: number;
  customerName: string;
  phone: string;
  status: CallTaskStatus;
  note?: string;
}

const orderStatusDisplay = Object.fromEntries(
  ORDER_STATUS_OPTIONS.map((option) => {
    const className =
      option.value === 'pending'
        ? 'text-warning'
        : option.value === 'processing'
          ? 'text-primary'
          : option.value === 'completed'
            ? 'text-success'
            : 'text-danger';

    return [option.value, { label: option.label, className }];
  }),
) as Record<OrderStatus, { label: string; className: string }>;

export function getCallTaskStatusDisplay(status: CallTaskStatus) {
  if (status === 'calling') {
    return { label: 'Đang gọi', className: 'text-primary' };
  }
  return orderStatusDisplay[status];
}

export function isCallTaskProcessed(status: CallTaskStatus) {
  return status !== STATUS_PENDING && status !== 'calling';
}
