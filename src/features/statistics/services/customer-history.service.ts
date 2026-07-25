import { apiClient } from '@/lib/axios/client';
import type { PaginatedResponse } from '@/types';

export const CUSTOMER_HISTORY_STATUS_ALL = '' as const;

export const CUSTOMER_HISTORY_STATUS_OPTIONS = [
  { value: CUSTOMER_HISTORY_STATUS_ALL, label: 'Tất cả' },
  { value: 'success', label: 'Thành công' },
  { value: 'recall', label: 'Chờ gọi lại' },
  { value: 'called', label: 'Từ chối' },
  { value: 'available,just_upload', label: 'Khả dụng' },
  { value: 'non_exist', label: 'Data lỗi' },
] as const;

export type CustomerHistoryStatus =
  (typeof CUSTOMER_HISTORY_STATUS_OPTIONS)[number]['value'];

export interface CustomerHistoryImportBatch {
  id: number;
  title: string;
}

export interface CustomerHistoryItem {
  id: number;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  is_available: string;
  import_batch?: CustomerHistoryImportBatch | null;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerHistoryParams {
  isAvailable?: string;
  name?: string;
  page?: number;
  perPage?: number;
}

export const CUSTOMER_HISTORY_QUERY_KEY = ['customer-history'] as const;
export const DEFAULT_CUSTOMER_HISTORY_PER_PAGE = 20;

export function buildCustomerHistoryParams(params: CustomerHistoryParams = {}) {
  const query: Record<string, string | number> = {
    per_page: params.perPage ?? DEFAULT_CUSTOMER_HISTORY_PER_PAGE,
    page: params.page ?? 1,
    sort: '-updated_at',
  };

  if (params.isAvailable) {
    query['filter[is_available]'] = params.isAvailable;
  }

  if (params.name?.trim()) {
    query['filter[name]'] = params.name.trim();
  }

  return query;
}

function toNumber(value: unknown): number {
  const num = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(num) ? num : 0;
}

function normalizeImportBatch(raw: unknown): CustomerHistoryImportBatch | null {
  if (!raw || typeof raw !== 'object') return null;

  const batch = raw as Record<string, unknown>;
  const id = toNumber(batch.id);
  if (!id) return null;

  return {
    id,
    title:
      typeof batch.title === 'string' && batch.title.trim()
        ? batch.title.trim()
        : `Gói #${id}`,
  };
}

function normalizeItem(raw: unknown): CustomerHistoryItem | null {
  if (!raw || typeof raw !== 'object') return null;

  const item = raw as Record<string, unknown>;
  const id = toNumber(item.id);
  if (!id) return null;

  const name =
    (typeof item.name === 'string' && item.name.trim()) ||
    (typeof item.customer_name === 'string' && item.customer_name.trim()) ||
    'Khách hàng';

  return {
    id,
    name,
    email: typeof item.email === 'string' && item.email.trim() ? item.email.trim() : undefined,
    phone: typeof item.phone === 'string' ? item.phone.trim() : '',
    address:
      typeof item.address === 'string' && item.address.trim()
        ? item.address.trim()
        : undefined,
    is_available:
      typeof item.is_available === 'string' && item.is_available.trim()
        ? item.is_available.trim()
        : 'available',
    import_batch: normalizeImportBatch(item.import_batch),
    created_at: typeof item.created_at === 'string' ? item.created_at : undefined,
    updated_at: typeof item.updated_at === 'string' ? item.updated_at : undefined,
  };
}

function normalizeCustomerHistoryResponse(
  data: unknown,
  perPage: number,
): PaginatedResponse<CustomerHistoryItem> {
  if (Array.isArray(data)) {
    const items = data
      .map(normalizeItem)
      .filter((item): item is CustomerHistoryItem => item !== null);

    return {
      data: items,
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: perPage,
        total: items.length,
      },
    };
  }

  if (
    data &&
    typeof data === 'object' &&
    Array.isArray((data as PaginatedResponse<CustomerHistoryItem>).data)
  ) {
    const payload = data as PaginatedResponse<unknown>;
    const items = payload.data
      .map(normalizeItem)
      .filter((item): item is CustomerHistoryItem => item !== null);

    return {
      data: items,
      meta: payload.meta ?? {
        current_page: 1,
        last_page: 1,
        per_page: perPage,
        total: items.length,
      },
    };
  }

  return {
    data: [],
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: perPage,
      total: 0,
    },
  };
}

const statusDisplay: Record<string, { label: string; className: string }> = {
  success: { label: 'Thành công', className: 'bg-success/10 text-success' },
  called: { label: 'Từ chối', className: 'bg-warning/10 text-warning' },
  recall: { label: 'Chờ gọi lại', className: 'bg-primary/10 text-primary' },
  reject: { label: 'Từ chối', className: 'bg-warning/10 text-warning' },
  just_upload: { label: 'Khả dụng', className: 'bg-sky-500/10 text-sky-600 dark:text-sky-400' },
  available: { label: 'Khả dụng', className: 'bg-sky-500/10 text-sky-600 dark:text-sky-400' },
  non_exist: { label: 'Data lỗi', className: 'bg-danger/10 text-danger' },
};

export function getCustomerHistoryStatusDisplay(status: string) {
  return (
    statusDisplay[status] ?? {
      label: status || '—',
      className: 'bg-slate-500/10 text-slate-500',
    }
  );
}

export const customerHistoryService = {
  async getCustomerHistory(
    params: CustomerHistoryParams = {},
  ): Promise<PaginatedResponse<CustomerHistoryItem>> {
    const perPage = params.perPage ?? DEFAULT_CUSTOMER_HISTORY_PER_PAGE;
    const { data } = await apiClient.get<unknown>('/my-customers', {
      params: buildCustomerHistoryParams(params),
    });

    return normalizeCustomerHistoryResponse(data, perPage);
  },
};
