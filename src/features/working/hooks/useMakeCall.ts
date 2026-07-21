import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { callService } from '@/features/working/services/call.service';
import { MY_CUSTOMERS_QUERY_KEY } from '@/features/working/types/call-task';
import { queryClient } from '@/lib/query/client';
import { getErrorMessage } from '@/utils';
import type { MakeCallPayload } from '@/features/working/services/call.service';

export function useMakeCall() {
  return useMutation({
    mutationFn: (payload: MakeCallPayload) => callService.makeCall(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: MY_CUSTOMERS_QUERY_KEY });
      toast.success(data.message || 'Đã lưu kết quả gọi');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không thể lưu kết quả gọi'));
    },
  });
}
