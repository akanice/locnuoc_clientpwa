import { HiClipboardCopy } from 'react-icons/hi';
import { copyTextToClipboard } from '@/utils/clipboard';

interface CopyToClipboardButtonProps {
  text: string;
  successMessage?: string;
  ariaLabel?: string;
  iconSize?: number;
  className?: string;
}

const defaultClassName =
  'inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary active:bg-slate-200 dark:hover:bg-slate-700 dark:hover:text-primary dark:active:bg-slate-600';

export function CopyToClipboardButton({
  text,
  successMessage = 'Đã sao chép',
  ariaLabel = 'Sao chép',
  iconSize = 16,
  className = defaultClassName,
}: CopyToClipboardButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => copyTextToClipboard(text, successMessage)}
      className={className}
    >
      <HiClipboardCopy size={iconSize} />
    </button>
  );
}
