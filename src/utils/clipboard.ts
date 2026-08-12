import { toast } from 'react-toastify';

export async function copyTextToClipboard(
  text: string,
  successMessage = 'Đã sao chép',
): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMessage);
    return true;
  } catch {
    toast.error('Không thể sao chép');
    return false;
  }
}
