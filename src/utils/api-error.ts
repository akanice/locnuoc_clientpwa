import { toast } from 'react-toastify';
import { isSessionExpiredError } from '@/lib/auth/session-error';
import { getErrorMessage } from '@/utils';

export function toastApiError(error: unknown, fallback?: string): void {
  if (isSessionExpiredError(error)) return;
  toast.error(getErrorMessage(error, fallback));
}
