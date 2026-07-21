import { useQuery } from '@tanstack/react-query';
import {
  MY_ORDERS_QUERY_KEY,
  myOrdersService,
  type MyOrdersParams,
} from '@/features/statistics/services/my-orders.service';

export function useMyOrders(params: MyOrdersParams) {
  return useQuery({
    queryKey: [...MY_ORDERS_QUERY_KEY, params],
    queryFn: () => myOrdersService.getMyOrders(params),
    placeholderData: (previous) => previous,
  });
}
