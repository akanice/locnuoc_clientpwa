import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CALL_RESULT_OPTIONS, type MakeCallStatus } from '@/features/working/services/call.service';

interface CallConfirmModalProps {
  open: boolean;
  customerName: string;
  status: MakeCallStatus | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function getStatusLabel(status: MakeCallStatus | null) {
  return CALL_RESULT_OPTIONS.find((option) => option.value === status)?.label ?? '';
}

export function CallConfirmModal({
  open,
  customerName,
  status,
  loading = false,
  onClose,
  onConfirm,
}: CallConfirmModalProps) {
  const statusLabel = getStatusLabel(status);

  return (
    <Modal open={open} title="Xác nhận kết quả gọi" onClose={onClose}>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        Xác nhận đánh dấu{' '}
        <span className="font-semibold text-slate-900 dark:text-slate-100">{statusLabel}</span>{' '}
        cho khách hàng{' '}
        <span className="font-semibold text-slate-900 dark:text-slate-100">{customerName}</span>?
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button type="button" loading={loading} disabled={!status} onClick={onConfirm}>
          Xác nhận
        </Button>
      </div>
    </Modal>
  );
}
