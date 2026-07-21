import { apiClient } from '@/lib/axios/client';
import type { PaginatedResponse } from '@/types';

export interface MyOrderCustomer {
  id?: number;
  name?: string | null;
  phone?: string | null;
}

export interface MyOrder {
  id: number;
  customer_id?: number | null;
  customer_name?: string | null;
  customer?: MyOrderCustomer | null;
  phone?: string | null;
  status?: string | null;
  note?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface MyOrdersParams {
  fromDate: string;
  toDate: string;
  page?: number;
  perPage?: number;
}

export const MY_ORDERS_QUERY_KEY = ['my-orders'] as const;
export const DEFAULT_ORDERS_PER_PAGE = 15;

export function buildMyOrdersParams(params: MyOrdersParams) {
  return {
    from_date: params.fromDate,
    to_date: params.toDate,
    page: params.page ?? 1,
    per_page: params.perPage ?? DEFAULT_ORDERS_PER_PAGE,
  };
}

function normalizeMyOrdersResponse(
  data: unknown,
): PaginatedResponse<MyOrder> {
  if (
    data &&
    typeof data === 'object' &&
    Array.isArray((data as PaginatedResponse<MyOrder>).data) &&
    (data as PaginatedResponse<MyOrder>).meta
  ) {
    return data as PaginatedResponse<MyOrder>;
  }

  if (Array.isArray(data)) {
    return {
      data,
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: data.length || DEFAULT_ORDERS_PER_PAGE,
        total: data.length,
      },
    };
  }

  return {
    data: [],
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: DEFAULT_ORDERS_PER_PAGE,
      total: 0,
    },
  };
}

export function getOrderCustomerName(order: MyOrder): string {
  return (
    order.customer_name?.trim() ||
    order.customer?.name?.trim() ||
    'Khách hàng'
  );
}

export function getOrderPhone(order: MyOrder): string {
  return order.phone?.trim() || order.customer?.phone?.trim() || '—';
}

export function getOrderStatusLabel(status?: string | null): string {
  switch (status) {
    case 'available':
      return 'Thành công';
    case 'called':
      return 'Không nhu cầu';
    case 'recall':
      return 'Không nghe máy';
    case 'non_exist':
      return 'Data lỗi';
    case 'pending':
      return 'Chờ xử lý';
    case 'processing':
      return 'Đang xử lý';
    case 'completed':
      return 'Hoàn thành';
    case 'cancelled':
      return 'Đã hủy';
    default:
      return status?.trim() || '—';
  }
}

export const myOrdersService = {
  async getMyOrders(params: MyOrdersParams): Promise<PaginatedResponse<MyOrder>> {
    const { data } = await apiClient.get<unknown>('/my-orders', {
      params: buildMyOrdersParams(params),
    });

    return normalizeMyOrdersResponse(data);
  },
};
