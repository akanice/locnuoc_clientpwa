import { apiClient } from '@/lib/axios/client';
import type { PaginatedResponse } from '@/types';

export interface ImportBatchStats {
  id: number;
  title: string;
  total_customers: number;
  assigned_count: number;
  available_count: number;
  called_count: number;
  rejected_count: number;
  success_count: number;
  non_exist_count: number;
}

export interface MyImportBatchStatsParams {
  id?: number;
  limit?: number;
  perPage?: number;
  page?: number;
}

export const MY_IMPORT_BATCH_STATS_QUERY_KEY = ['my-import-batches-stats'] as const;
export const DEFAULT_BATCH_STATS_PER_PAGE = 15;

export function buildMyImportBatchStatsParams(params: MyImportBatchStatsParams = {}) {
  const query: Record<string, number> = {
    per_page: params.perPage ?? DEFAULT_BATCH_STATS_PER_PAGE,
  };

  if (params.page != null) {
    query.page = params.page;
  }

  if (params.limit != null) {
    query.limit = params.limit;
  }

  if (params.id != null) {
    query.id = params.id;
  }

  return query;
}

function toNumber(value: unknown): number {
  const num = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(num) ? num : 0;
}

function normalizeItem(raw: unknown): ImportBatchStats | null {
  if (!raw || typeof raw !== 'object') return null;

  const item = raw as Record<string, unknown>;
  const id = toNumber(item.id);
  if (!id) return null;

  return {
    id,
    title: typeof item.title === 'string' && item.title.trim() ? item.title.trim() : `Gói #${id}`,
    total_customers: toNumber(item.total_customers),
    assigned_count: toNumber(item.assigned_count),
    available_count: toNumber(item.available_count),
    called_count: toNumber(item.called_count),
    rejected_count: toNumber(item.rejected_count),
    success_count: toNumber(item.success_count),
    non_exist_count: toNumber(item.non_exist_count),
  };
}

function normalizeMyImportBatchStatsResponse(
  data: unknown,
  perPage: number,
): PaginatedResponse<ImportBatchStats> {
  if (Array.isArray(data)) {
    const items = data
      .map(normalizeItem)
      .filter((item): item is ImportBatchStats => item !== null);

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

  if (data && typeof data === 'object') {
    const payload = data as PaginatedResponse<ImportBatchStats> & {
      data?: unknown;
      meta?: PaginatedResponse<ImportBatchStats>['meta'];
    };

    if (Array.isArray(payload.data)) {
      const items = payload.data
        .map(normalizeItem)
        .filter((item): item is ImportBatchStats => item !== null);

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

    const single = normalizeItem(data);
    if (single) {
      return {
        data: [single],
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: perPage,
          total: 1,
        },
      };
    }
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

export function getBatchSuccessRate(stats: ImportBatchStats): number {
  const base = stats.called_count || stats.assigned_count;
  if (!base) return 0;
  return Math.round((stats.success_count / base) * 100);
}

export function getBatchProgressPercent(stats: ImportBatchStats): number {
  if (!stats.assigned_count) return 0;
  const processed =
    stats.called_count + stats.rejected_count + stats.success_count + stats.non_exist_count;
  return Math.min(100, Math.round((processed / stats.assigned_count) * 100));
}

export const myImportBatchStatsService = {
  async getStats(
    params: MyImportBatchStatsParams = {},
  ): Promise<PaginatedResponse<ImportBatchStats>> {
    const perPage = params.perPage ?? DEFAULT_BATCH_STATS_PER_PAGE;
    const { data } = await apiClient.get<unknown>('/my-import-batches/stats', {
      params: buildMyImportBatchStatsParams(params),
    });

    return normalizeMyImportBatchStatsResponse(data, perPage);
  },
};
