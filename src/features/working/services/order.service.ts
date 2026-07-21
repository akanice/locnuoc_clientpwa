import { apiClient } from '@/lib/axios/client';

export const STATUS_PENDING = 'pending' as const;
export const STATUS_PROCESSING = 'processing' as const;
export const STATUS_COMPLETED = 'completed' as const;
export const STATUS_CANCELLED = 'cancelled' as const;

export type OrderStatus =
  | typeof STATUS_PENDING
  | typeof STATUS_PROCESSING
  | typeof STATUS_COMPLETED
  | typeof STATUS_CANCELLED;

export interface CreateOrderPayload {
  customer_id: number;
  status: OrderStatus;
  note: string;
}

export const ORDER_STATUS_OPTIONS = [
  { value: STATUS_PENDING, label: 'Chờ xử lý' },
  { value: STATUS_PROCESSING, label: 'Đang xử lý' },
  { value: STATUS_COMPLETED, label: 'Hoàn thành' },
  { value: STATUS_CANCELLED, label: 'Đã hủy' },
] as const;

export const orderService = {
  async create(payload: CreateOrderPayload): Promise<{ message?: string }> {
    const { data } = await apiClient.post<{ message?: string }>('/orders', payload);
    return data;
  },
};
