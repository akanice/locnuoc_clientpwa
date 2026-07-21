import { useState } from 'react';
import {
  HiCheckCircle,
  HiClock,
  HiCog,
  HiXCircle,
} from 'react-icons/hi';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import {
  ORDER_STATUS_OPTIONS,
  type OrderStatus,
} from '@/features/working/services/order.service';
import { useCreateOrder } from '@/features/working/hooks/useOrder';

interface CallResultModalProps {
  open: boolean;
  customerId: number;
  customerName: string;
  onClose: () => void;
}

const statusStyles: Record<
  OrderStatus,
  {
    icon: typeof HiCheckCircle;
    base: string;
    selected: string;
    iconSelected: string;
  }
> = {
  pending: {
    icon: HiClock,
    base: 'border-warning/20 bg-warning/5 text-amber-700 hover:border-warning/35 hover:bg-warning/10 dark:text-amber-400',
    selected: 'border-warning bg-warning text-white shadow-sm ring-2 ring-warning/25',
    iconSelected: 'text-white',
  },
  processing: {
    icon: HiCog,
    base: 'border-primary/20 bg-primary/5 text-primary hover:border-primary/35 hover:bg-primary/10',
    selected: 'border-primary bg-primary text-white shadow-sm ring-2 ring-primary/25',
    iconSelected: 'text-white',
  },
  completed: {
    icon: HiCheckCircle,
    base: 'border-success/20 bg-success/5 text-success hover:border-success/35 hover:bg-success/10',
    selected: 'border-success bg-success text-white shadow-sm ring-2 ring-success/25',
    iconSelected: 'text-white',
  },
  cancelled: {
    icon: HiXCircle,
    base: 'border-danger/20 bg-danger/5 text-danger hover:border-danger/35 hover:bg-danger/10',
    selected: 'border-danger bg-danger text-white shadow-sm ring-2 ring-danger/25',
    iconSelected: 'text-white',
  },
};

export function CallResultModal({
  open,
  customerId,
  customerName,
  onClose,
}: CallResultModalProps) {
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [note, setNote] = useState('');
  const createOrder = useCreateOrder();

  const handleClose = () => {
    setStatus(null);
    setNote('');
    onClose();
  };

  const handleSave = () => {
    if (!status) return;

    createOrder.mutate(
      {
        customer_id: customerId,
        status,
        note: note.trim(),
      },
      { onSuccess: handleClose },
    );
  };

  return (
    <Modal open={open} title={`Kết quả gọi — ${customerName}`} onClose={handleClose}>
      <div className="grid grid-cols-2 gap-2.5">
        {ORDER_STATUS_OPTIONS.map((option) => {
          const isSelected = status === option.value;
          const style = statusStyles[option.value];
          const Icon = style.icon;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setStatus(option.value)}
              className={[
                'flex min-h-[4.5rem] flex-col items-center justify-center gap-1.5 rounded-xl border-2 px-2 py-3 text-center text-xs font-semibold transition-all duration-150 active:scale-[0.98] sm:text-sm',
                isSelected ? style.selected : style.base,
              ].join(' ')}
            >
              <Icon
                size={22}
                className={isSelected ? style.iconSelected : undefined}
              />
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <label htmlFor="call-note" className="mb-1.5 block text-sm font-medium">
          Ghi chú
        </label>
        <textarea
          id="call-note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Nhập ghi chú..."
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 transition-colors duration-150 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
        <Button loading={createOrder.isPending} disabled={!status} onClick={handleSave}>
          Lưu và đóng
        </Button>
      </div>
    </Modal>
  );
}
