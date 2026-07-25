import { useQuery } from '@tanstack/react-query';
import {
  MY_IMPORT_BATCH_STATS_QUERY_KEY,
  myImportBatchStatsService,
  type MyImportBatchStatsParams,
} from '@/features/statistics/services/my-import-batch-stats.service';

export function useMyImportBatchStats(params: MyImportBatchStatsParams = {}) {
  return useQuery({
    queryKey: [...MY_IMPORT_BATCH_STATS_QUERY_KEY, params],
    queryFn: () => myImportBatchStatsService.getStats(params),
    placeholderData: (previous) => previous,
  });
}
