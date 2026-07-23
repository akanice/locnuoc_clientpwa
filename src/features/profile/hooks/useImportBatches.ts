import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import {
  DEFAULT_IMPORT_BATCHES_PER_PAGE,
  IMPORT_BATCHES_QUERY_KEY,
  importBatchService,
  type ImportBatch,
} from '@/features/profile/services/import-batch.service';

type UseImportBatchesOptions = Pick<UseQueryOptions<ImportBatch[]>, 'enabled'>;

export function useImportBatches(options?: UseImportBatchesOptions) {
  return useQuery({
    queryKey: [...IMPORT_BATCHES_QUERY_KEY, DEFAULT_IMPORT_BATCHES_PER_PAGE],
    queryFn: () => importBatchService.getImportBatches(DEFAULT_IMPORT_BATCHES_PER_PAGE),
    enabled: options?.enabled ?? true,
  });
}
