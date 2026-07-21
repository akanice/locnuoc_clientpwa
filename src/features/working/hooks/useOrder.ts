import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { orderService } from '@/features/working/services/order.service';
import {
  MY_CUSTOMERS_QUERY_KEY,
} from '@/features/working/types/call-task';
import { queryClient } from '@/lib/query/client';
import { getErrorMessage } from '@/utils';
import type { CreateOrderPayload } from '@/features/working/services/order.service';

export function useCreateOrder() {
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => orderService.create(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: MY_CUSTOMERS_QUERY_KEY });

      toast.success(data.message || 'Đã lưu đơn hàng');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không thể tạo đơn hàng'));
    },
  });
}
