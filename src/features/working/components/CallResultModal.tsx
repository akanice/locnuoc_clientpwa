import { useState } from 'react';
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiMinusCircle,
  HiPhone,
} from 'react-icons/hi';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import {
  buildMakeCallNote,
  CALL_RESULT_OPTIONS,
  getDefaultAppointmentValue,
  MAKE_CALL_STATUS_SUCCESS,
  type MakeCallStatus,
} from '@/features/working/services/call.service';
import { useMakeCall } from '@/features/working/hooks/useMakeCall';
import { useAuthStore, selectUser } from '@/stores/auth.store';

interface CallResultModalProps {
  open: boolean;
  customerId: number;
  customerName: string;
  onClose: () => void;
  onSaved?: (status: MakeCallStatus) => void;
}

const statusStyles: Record<
  MakeCallStatus,
  {
    icon: typeof HiCheckCircle;
    base: string;
    selected: string;
    iconSelected: string;
  }
> = {
  success: {
    icon: HiCheckCircle,
    base: 'border-success/20 bg-success/5 text-success hover:border-success/35 hover:bg-success/10',
    selected: 'border-success bg-success text-white shadow-xl ring-2 ring-success/25',
    iconSelected: 'text-white',
  },
  called: {
    icon: HiPhone,
    base: 'border-warning/20 bg-warning/5 text-amber-700 hover:border-warning/35 hover:bg-warning/10 dark:text-amber-400',
    selected: 'border-warning bg-warning text-white shadow-xl ring-2 ring-warning/25',
    iconSelected: 'text-white',
  },
  recall: {
    icon: HiMinusCircle,
    base: 'border-primary/20 bg-primary/5 text-primary hover:border-primary/35 hover:bg-primary/10',
    selected: 'border-primary bg-primary text-white shadow-xl ring-2 ring-primary/25',
    iconSelected: 'text-white',
  },
  non_exist: {
    icon: HiExclamationCircle,
    base: 'border-danger/20 bg-danger/5 text-danger hover:border-danger/35 hover:bg-danger/10',
    selected: 'border-danger bg-danger text-white shadow-xl ring-2 ring-danger/25',
    iconSelected: 'text-white',
  },
};

const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 transition-colors duration-150 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400';

export function CallResultModal({
  open,
  customerId,
  customerName,
  onClose,
  onSaved,
}: CallResultModalProps) {
  const user = useAuthStore(selectUser);
  const [status, setStatus] = useState<MakeCallStatus | null>(null);
  const [note, setNote] = useState('');
  const [appointmentAt, setAppointmentAt] = useState(getDefaultAppointmentValue);
  const makeCall = useMakeCall();

  const isSuccessSelected = status === MAKE_CALL_STATUS_SUCCESS;

  const resetForm = () => {
    setStatus(null);
    setNote('');
    setAppointmentAt(getDefaultAppointmentValue());
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSelectStatus = (value: MakeCallStatus) => {
    setStatus(value);

    if (value === MAKE_CALL_STATUS_SUCCESS) {
      setAppointmentAt(getDefaultAppointmentValue());
    }
  };

  const handleSave = () => {
    if (!status || !user?.id) return;

    const selectedStatus = status;

    makeCall.mutate(
      {
        customer_id: customerId,
        user_id: user.id,
        status: selectedStatus,
        note:
          selectedStatus === MAKE_CALL_STATUS_SUCCESS
            ? buildMakeCallNote(note, appointmentAt)
            : '',
      },
      {
        onSuccess: () => {
          resetForm();
          onClose();
          onSaved?.(selectedStatus);
        },
      },
    );
  };

  return (
    <Modal open={open} title={`Kết quả gọi — ${customerName}`} onClose={handleClose}>
      <div className="grid grid-cols-2 gap-2.5">
        {CALL_RESULT_OPTIONS.map((option) => {
          const isSelected = status === option.value;
          const style = statusStyles[option.value];
          const Icon = style.icon;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelectStatus(option.value)}
              className={[
                'flex min-h-[4.5rem] flex-col items-center justify-center gap-1.5 rounded-xl border-2 px-2 py-3 text-center text-xs font-semibold transition-all duration-150 active:scale-[0.98] sm:text-sm',
                isSelected ? style.selected : style.base,
              ].join(' ')}
            >
              <Icon size={22} className={isSelected ? style.iconSelected : undefined} />
              {option.label}
            </button>
          );
        })}
      </div>

      {isSuccessSelected && (
        <>
          <div className="mt-4">
            <label htmlFor="call-appointment" className="mb-1.5 block text-sm font-medium">
              Giờ hẹn
            </label>
            <input
              id="call-appointment"
              type="datetime-local"
              value={appointmentAt}
              onChange={(event) => setAppointmentAt(event.target.value)}
              className={inputClassName}
            />
          </div>

          <div className="mt-4">
            <label htmlFor="call-note" className="mb-1.5 block text-sm font-medium">
              Ghi chú
            </label>
            <textarea
              id="call-note"
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Nhập ghi chú..."
              className={`${inputClassName} resize-none`}
            />
          </div>
        </>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
        <Button
          loading={makeCall.isPending}
          disabled={!status || !user?.id}
          onClick={handleSave}
        >
          Lưu và đóng
        </Button>
      </div>
    </Modal>
  );
}
