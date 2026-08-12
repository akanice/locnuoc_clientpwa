import { apiClient } from '@/lib/axios/client';

export const CALL_RESULT_OPTIONS = [
  { value: 'success', label: 'Thành công' },
  { value: 'recall', label: 'Không nghe máy' },
  { value: 'called', label: 'Không nhu cầu' },
  { value: 'non_exist', label: 'Data lỗi' },
] as const;

export type MakeCallStatus = (typeof CALL_RESULT_OPTIONS)[number]['value'];

export const MAKE_CALL_STATUS_SUCCESS = 'success' as const;

export interface MakeCallPayload {
  customer_id: number;
  user_id: number;
  status: MakeCallStatus;
  note: string;
  customer_name?: string;
  customer_phone?: string;
  customer_address?: string;
}

export function getDefaultAppointmentValue(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export function formatAppointmentDisplay(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export interface MakeCallNoteInput {
  name: string;
  phone: string;
  address: string;
  appointmentAt: string;
  note: string;
}

export function buildMakeCallNote({
  name,
  phone,
  address,
  appointmentAt,
  note,
}: MakeCallNoteInput): string {
  const appointmentLabel = appointmentAt ? formatAppointmentDisplay(appointmentAt) : '';

  return [
    name.trim(),
    phone.trim(),
    address.trim(),
    appointmentLabel,
    `"Ghi chú":${note.trim()}`,
  ].join(' - ');
}

export const callService = {
  async makeCall(payload: MakeCallPayload): Promise<{ message?: string }> {
    const { data } = await apiClient.post<{ message?: string }>('/make-call', payload);
    return data;
  },
};
