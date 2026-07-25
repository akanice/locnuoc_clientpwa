import { useQuery } from '@tanstack/react-query';
import {
  CUSTOMER_HISTORY_QUERY_KEY,
  customerHistoryService,
  type CustomerHistoryParams,
} from '@/features/statistics/services/customer-history.service';

export function useCustomerHistory(params: CustomerHistoryParams) {
  return useQuery({
    queryKey: [...CUSTOMER_HISTORY_QUERY_KEY, params],
    queryFn: () => customerHistoryService.getCustomerHistory(params),
    placeholderData: (previous) => previous,
  });
}
