import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import {
  customerService,
  type MyCustomersParams,
} from '@/features/working/services/customer.service';
import type { CallTask } from '@/features/working/types/call-task';
import { MY_CUSTOMERS_QUERY_KEY } from '@/features/working/types/call-task';

type UseMyCustomersOptions = Pick<UseQueryOptions<CallTask[]>, 'enabled'>;

export function useMyCustomers(params: MyCustomersParams, options?: UseMyCustomersOptions) {
  return useQuery({
    queryKey: [...MY_CUSTOMERS_QUERY_KEY, params],
    queryFn: () => customerService.getMyCustomers(params),
    enabled: options?.enabled ?? true,
  });
}
