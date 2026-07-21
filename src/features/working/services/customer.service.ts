import { apiClient } from '@/lib/axios/client';
import type { CallTask } from '@/features/working/types/call-task';
import type { PaginatedResponse } from '@/types';

export const CUSTOMER_TAB_WAITING = 'waiting' as const;
export const CUSTOMER_TAB_CALLED = 'called' as const;
export const CUSTOMER_TAB_NON_EXIST = 'non_exist' as const;
export const CUSTOMER_TAB_RECALL = 'recall' as const;

export type CustomerTab =
  | typeof CUSTOMER_TAB_WAITING
  | typeof CUSTOMER_TAB_CALLED
  | typeof CUSTOMER_TAB_NON_EXIST
  | typeof CUSTOMER_TAB_RECALL;

export const CUSTOMER_TAB_OPTIONS = [
  {
    value: CUSTOMER_TAB_WAITING,
    label: 'Chờ gọi',
    isAvailable: 'available,just_upload',
  },
  {
    value: CUSTOMER_TAB_CALLED,
    label: 'Không thành công',
    isAvailable: 'called',
  },
  {
    value: CUSTOMER_TAB_NON_EXIST,
    label: 'Data lỗi',
    isAvailable: 'non_exist',
  },
  {
    value: CUSTOMER_TAB_RECALL,
    label: 'Chờ gọi lại',
    isAvailable: 'recall',
  },
] as const;

export interface ApiCustomer {
  id: number;
  name?: string | null;
  customer_name?: string | null;
  phone?: string | null;
  is_available?: string | null;
  note?: string | null;
}

export interface MyCustomersParams {
  isAvailable?: string;
  name?: string;
  phone?: string;
  search?: string;
  sort?: string;
  perPage?: number | 'all' | -1;
}

export function buildMyCustomersQueryParams(tab: CustomerTab): MyCustomersParams {
  const option = CUSTOMER_TAB_OPTIONS.find((item) => item.value === tab);

  return {
    isAvailable: option?.isAvailable,
    perPage: 'all',
    sort: '-created_at',
  };
}

function buildMyCustomersParams(params: MyCustomersParams = {}) {
  const query: Record<string, string | number> = {
    per_page: params.perPage ?? 'all',
  };

  if (params.isAvailable) {
    query['filter[is_available]'] = params.isAvailable;
  }

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

function mapToCallTask(customer: ApiCustomer): CallTask {
  return {
    id: customer.id,
    customerName:
      customer.name?.trim() ||
      customer.customer_name?.trim() ||
      'Khách hàng',
    phone: customer.phone?.trim() || '',
    status: customer.is_available?.trim() || 'available',
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
    const { data } = await apiClient.get<ApiCustomer[] | PaginatedResponse<ApiCustomer>>(
      '/my-customers',
      {
        params: buildMyCustomersParams(params),
      },
    );

    return normalizeCustomers(data).map(mapToCallTask);
  },
};
