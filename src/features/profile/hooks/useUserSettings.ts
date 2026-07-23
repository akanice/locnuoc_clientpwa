import { useMutation, useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { queryClient } from '@/lib/query/client';
import { getErrorMessage } from '@/utils';
import {
  USER_SETTINGS_QUERY_KEY,
  userSettingsService,
  type UpdateUserSettingsPayload,
  type UserSettings,
} from '@/features/profile/services/user-settings.service';

type UseUserSettingsOptions = Pick<UseQueryOptions<UserSettings>, 'enabled'>;

export function useUserSettings(options?: UseUserSettingsOptions) {
  return useQuery({
    queryKey: USER_SETTINGS_QUERY_KEY,
    queryFn: () => userSettingsService.getUserSettings(),
    enabled: options?.enabled ?? true,
  });
}

export function useUpdateUserSettings() {
  return useMutation({
    mutationFn: (payload: UpdateUserSettingsPayload) =>
      userSettingsService.updateUserSettings(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(USER_SETTINGS_QUERY_KEY, data);
      toast.success('Đã lưu cài đặt data sẽ nhận');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không thể lưu cài đặt'));
    },
  });
}
