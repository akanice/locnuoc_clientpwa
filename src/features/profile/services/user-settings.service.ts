import { apiClient } from '@/lib/axios/client';

export interface UserSettings {
  max_assign_quantity: number | null;
  import_batch_ids: number[];
}

export interface UpdateUserSettingsPayload {
  max_assign_quantity: number;
  import_batch_ids: number[];
}

export const USER_SETTINGS_QUERY_KEY = ['user-settings'] as const;

function normalizeUserSettings(data: unknown): UserSettings {
  if (!data || typeof data !== 'object') {
    return { max_assign_quantity: null, import_batch_ids: [] };
  }

  const raw = data as Record<string, unknown>;
  const maxAssignQuantity = raw.max_assign_quantity;
  const importBatchIds = raw.import_batch_ids;

  return {
    max_assign_quantity:
      typeof maxAssignQuantity === 'number'
        ? maxAssignQuantity
        : typeof maxAssignQuantity === 'string' && maxAssignQuantity.trim() !== ''
          ? Number(maxAssignQuantity)
          : null,
    import_batch_ids: Array.isArray(importBatchIds)
      ? importBatchIds
          .map((id) => Number(id))
          .filter((id) => Number.isFinite(id) && id > 0)
      : [],
  };
}

export const userSettingsService = {
  async getUserSettings(): Promise<UserSettings> {
    const { data } = await apiClient.get<unknown>('/user-settings');
    return normalizeUserSettings(data);
  },

  async updateUserSettings(payload: UpdateUserSettingsPayload): Promise<UserSettings> {
    const { data } = await apiClient.put<unknown>('/user-settings', payload);
    return normalizeUserSettings(data);
  },
};
