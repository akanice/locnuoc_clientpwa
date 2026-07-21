import { type ReactNode } from 'react';
import { HiX } from 'react-icons/hi';

interface ModalProps {
  open: boolean;
  title?: string;
  onClose?: () => void;
  children: ReactNode;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm animate-fade-in"
        aria-hidden
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal
        aria-labelledby={title ? 'modal-title' : undefined}
        onClick={(event) => event.stopPropagation()}
        className="relative flex max-h-[min(90dvh,640px)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl animate-modal-in dark:border-slate-700 dark:bg-slate-800"
      >
        {(title || onClose) && (
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-700">
            {title ? (
              <h3 id="modal-title" className="flex-1 text-lg font-semibold leading-snug">
                {title}
              </h3>
            ) : (
              <span className="flex-1" />
            )}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Đóng"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
              >
                <HiX size={20} />
              </button>
            )}
          </div>
        )}
        <div className="overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
