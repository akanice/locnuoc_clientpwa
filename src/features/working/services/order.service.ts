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

export const orderService = {
  async create(payload: CreateOrderPayload): Promise<{ message?: string }> {
    const { data } = await apiClient.post<{ message?: string }>('/orders', payload);
    return data;
  },
};
