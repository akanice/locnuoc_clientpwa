export const MY_CUSTOMERS_QUERY_KEY = ['my-customers'] as const;
/** @deprecated Use MY_CUSTOMERS_QUERY_KEY with status instead */
export const CALL_TASKS_QUERY_KEY = MY_CUSTOMERS_QUERY_KEY;

export type CustomerAvailability = 'available' | 'just_upload' | 'called' | 'recall' | 'non_exist';

export type CallTaskStatus = 'calling' | CustomerAvailability | (string & {});

export interface CallTask {
  id: number;
  customerName: string;
  phone: string;
  status: CallTaskStatus;
  note?: string;
}

const availabilityDisplay: Record<string, { label: string; className: string }> = {
  available: { label: 'Chờ gọi', className: 'text-success' },
  just_upload: { label: 'Chờ gọi', className: 'text-success' },
  called: { label: 'Không thành công', className: 'text-warning' },
  recall: { label: 'Chờ gọi lại', className: 'text-primary' },
  non_exist: { label: 'Data lỗi', className: 'text-danger' },
};

export function getCallTaskStatusDisplay(status: CallTaskStatus) {
  if (status === 'calling') {
    return { label: 'Đang gọi', className: 'text-primary' };
  }

  return availabilityDisplay[status] ?? { label: status, className: 'text-slate-500' };
}

export function isCallTaskCallable(status: CallTaskStatus) {
  return status === 'available' || status === 'just_upload' || status === 'recall';
}

export function isCallTaskProcessed(status: CallTaskStatus) {
  return !isCallTaskCallable(status) && status !== 'calling';
}
