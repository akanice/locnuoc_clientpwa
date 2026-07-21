import { apiClient } from '@/lib/axios/client';
import {
  STATUS_PENDING,
  type OrderStatus,
} from '@/features/working/services/order.service';
import type { CallTask } from '@/features/working/types/call-task';
import type { PaginatedResponse } from '@/types';

export interface ApiCustomer {
  id: number;
  name?: string | null;
  customer_name?: string | null;
  phone?: string | null;
  status?: OrderStatus;
  order_status?: OrderStatus;
  note?: string | null;
}

export interface MyCustomersParams {
  /** Lọc phía client — backend không hỗ trợ filter order_status */
  orderStatus?: OrderStatus;
  name?: string;
  phone?: string;
  search?: string;
  sort?: string;
  perPage?: number | 'all' | -1;
}

export function buildMyCustomersQueryParams(orderStatus: OrderStatus): MyCustomersParams {
  return {
    orderStatus,
    perPage: 'all',
    sort: '-created_at',
  };
}

function buildMyCustomersParams(params: MyCustomersParams = {}) {
  const query: Record<string, string | number> = {
    per_page: params.perPage ?? 'all',
  };

  if (params.name?.trim()) {
    query['filter[name]'] = params.name.trim();
  }

  if (params.phone?.trim()) {
    query['filter[phone]'] = params.phone.trim();
  }

  if (params.search?.trim()) {
    query['filter[search]'] = params.search.trim();
  }

  if (params.sort) {
    query.sort = params.sort;
  }

  return query;
}

function getCustomerOrderStatus(customer: ApiCustomer, fallbackStatus: OrderStatus): OrderStatus {
  return customer.order_status ?? customer.status ?? fallbackStatus;
}

function mapToCallTask(customer: ApiCustomer, fallbackStatus: OrderStatus): CallTask {
  const status = getCustomerOrderStatus(customer, fallbackStatus);

  return {
    id: customer.id,
    customerName:
      customer.name?.trim() ||
      customer.customer_name?.trim() ||
      'Khách hàng',
    phone: customer.phone?.trim() || '',
    status,
    note: customer.note?.trim() || undefined,
  };
}

function normalizeCustomers(data: unknown): ApiCustomer[] {
  if (Array.isArray(data)) return data;
  if (
    data &&
    typeof data === 'object' &&
    Array.isArray((data as PaginatedResponse<ApiCustomer>).data)
  ) {
    return (data as PaginatedResponse<ApiCustomer>).data;
  }
  return [];
}

export const customerService = {
  async getMyCustomers(params: MyCustomersParams = {}): Promise<CallTask[]> {
    const fallbackStatus = params.orderStatus ?? STATUS_PENDING;
    const { data } = await apiClient.get<ApiCustomer[] | PaginatedResponse<ApiCustomer>>(
      '/my-customers',
      {
        params: buildMyCustomersParams(params),
      },
    );

    let items = normalizeCustomers(data);

    if (params.orderStatus) {
      items = items.filter(
        (item) => getCustomerOrderStatus(item, fallbackStatus) === params.orderStatus,
      );
    }

    return items.map((item) => mapToCallTask(item, fallbackStatus));
  },
};
