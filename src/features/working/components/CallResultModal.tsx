import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import {
  buildMakeCallNote,
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
  customerPhone?: string;
  customerAddress?: string;
  onClose: () => void;
  onSaved?: (status: MakeCallStatus, note?: string) => void;
}

const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 transition-colors duration-150 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400';

export function CallResultModal({
  open,
  customerId,
  customerName,
  customerPhone = '',
  customerAddress = '',
  onClose,
  onSaved,
}: CallResultModalProps) {
  const user = useAuthStore(selectUser);
  const [formCustomerName, setFormCustomerName] = useState('');
  const [formCustomerPhone, setFormCustomerPhone] = useState('');
  const [formCustomerAddress, setFormCustomerAddress] = useState('');
  const [note, setNote] = useState('');
  const [appointmentAt, setAppointmentAt] = useState(getDefaultAppointmentValue);
  const makeCall = useMakeCall();

  useEffect(() => {
    if (!open) return;

    setFormCustomerName(customerName);
    setFormCustomerPhone(customerPhone);
    setFormCustomerAddress(customerAddress);
    setAppointmentAt(getDefaultAppointmentValue());
  }, [open, customerName, customerPhone, customerAddress]);

  const resetForm = () => {
    setFormCustomerName('');
    setFormCustomerPhone('');
    setFormCustomerAddress('');
    setNote('');
    setAppointmentAt(getDefaultAppointmentValue());
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    if (!user?.id) return;

    const builtNote = buildMakeCallNote({
      name: formCustomerName,
      phone: formCustomerPhone,
      address: formCustomerAddress,
      appointmentAt,
      note,
    });

    makeCall.mutate(
      {
        customer_id: customerId,
        user_id: user.id,
        status: MAKE_CALL_STATUS_SUCCESS,
        note: builtNote,
        customer_name: formCustomerName.trim(),
        customer_phone: formCustomerPhone.trim(),
        customer_address: formCustomerAddress.trim(),
      },
      {
        onSuccess: () => {
          resetForm();
          onClose();
          onSaved?.(MAKE_CALL_STATUS_SUCCESS, builtNote);
        },
      },
    );
  };

  return (
    <Modal open={open} title={`Thành công — ${customerName}`} onClose={handleClose}>
      <div>
        <label htmlFor="call-customer-name" className="mb-1.5 block text-sm font-medium">
          Tên khách hàng
        </label>
        <input
          id="call-customer-name"
          type="text"
          value={formCustomerName}
          onChange={(event) => setFormCustomerName(event.target.value)}
          placeholder="Nhập tên khách hàng..."
          className={inputClassName}
        />
      </div>

      <div className="mt-4">
        <label htmlFor="call-customer-phone" className="mb-1.5 block text-sm font-medium">
          Số điện thoại
        </label>
        <input
          id="call-customer-phone"
          type="tel"
          value={formCustomerPhone}
          onChange={(event) => setFormCustomerPhone(event.target.value)}
          placeholder="Nhập số điện thoại..."
          className={inputClassName}
        />
      </div>

      <div className="mt-4">
        <label htmlFor="call-customer-address" className="mb-1.5 block text-sm font-medium">
          Địa chỉ
        </label>
        <textarea
          id="call-customer-address"
          rows={4}
          value={formCustomerAddress}
          onChange={(event) => setFormCustomerAddress(event.target.value)}
          placeholder="Nhập địa chỉ..."
          className={`${inputClassName} resize-none`}
        />
      </div>

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

      <div className="mt-6 grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
        <Button loading={makeCall.isPending} disabled={!user?.id} onClick={handleSave}>
          Xác nhận
        </Button>
      </div>
    </Modal>
  );
}
