import { apiClient } from '@/lib/axios/client';
import type { PaginatedResponse } from '@/types';

export const PACKAGE_FILTER_TAG = 'tag' as const;
export const PACKAGE_FILTER_TITLE = 'title' as const;

export type PackageFilterType =
  | typeof PACKAGE_FILTER_TAG
  | typeof PACKAGE_FILTER_TITLE;

export const PACKAGE_FILTER_OPTIONS = [
  { value: PACKAGE_FILTER_TAG, label: 'Theo Tag' },
  { value: PACKAGE_FILTER_TITLE, label: 'Theo Tên nhóm' },
] as const;

export interface ImportBatch {
  id: number;
  title: string;
  total_rows: number;
  success_rows: number;
  failed_rows: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export const IMPORT_BATCHES_QUERY_KEY = ['import-batches'] as const;
export const DEFAULT_IMPORT_BATCHES_PER_PAGE = 100;

function normalizeImportBatches(data: unknown): ImportBatch[] {
  if (Array.isArray(data)) return data as ImportBatch[];

  if (
    data &&
    typeof data === 'object' &&
    Array.isArray((data as PaginatedResponse<ImportBatch>).data)
  ) {
    return (data as PaginatedResponse<ImportBatch>).data;
  }

  return [];
}

export function getPackageNameOptions(
  batches: ImportBatch[],
  filterType: PackageFilterType | '',
): string[] {
  if (!filterType) return [];

  const values = new Set<string>();

  for (const batch of batches) {
    if (filterType === PACKAGE_FILTER_TAG) {
      for (const tag of batch.tags ?? []) {
        const trimmed = tag?.trim();
        if (trimmed) values.add(trimmed);
      }
      continue;
    }

    const title = batch.title?.trim();
    if (title) values.add(title);
  }

  return Array.from(values).sort((a, b) => a.localeCompare(b, 'vi'));
}

export function getBatchesByPackageName(
  batches: ImportBatch[],
  filterType: PackageFilterType | '',
  packageName: string,
): ImportBatch[] {
  const trimmedName = packageName.trim();
  if (!filterType || !trimmedName) return [];

  if (filterType === PACKAGE_FILTER_TAG) {
    return batches.filter((batch) =>
      (batch.tags ?? []).some((tag) => tag?.trim() === trimmedName),
    );
  }

  return batches.filter((batch) => batch.title?.trim() === trimmedName);
}

export const importBatchService = {
  async getImportBatches(
    perPage = DEFAULT_IMPORT_BATCHES_PER_PAGE,
  ): Promise<ImportBatch[]> {
    const { data } = await apiClient.get<ImportBatch[] | PaginatedResponse<ImportBatch>>(
      '/customers/import-batches',
      {
        params: { per_page: perPage },
      },
    );

    return normalizeImportBatches(data);
  },
};
