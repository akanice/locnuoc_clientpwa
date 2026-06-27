import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HiPhone, HiPhoneIncoming, HiPhoneMissedCall } from 'react-icons/hi';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';

interface CallTask {
  id: number;
  customerName: string;
  phone: string;
  status: 'pending' | 'calling' | 'completed' | 'missed';
  note?: string;
}

const mockTasks: CallTask[] = [
  { id: 1, customerName: 'Nguyễn Văn A', phone: '0901234567', status: 'pending' },
  { id: 2, customerName: 'Trần Thị B', phone: '0912345678', status: 'pending' },
  { id: 3, customerName: 'Lê Văn C', phone: '0923456789', status: 'completed', note: 'Đã chốt đơn' },
  { id: 4, customerName: 'Phạm Thị D', phone: '0934567890', status: 'missed' },
];

const statusConfig = {
  pending: { label: 'Chờ gọi', color: 'var(--color-warning)' },
  calling: { label: 'Đang gọi', color: 'var(--color-primary)' },
  completed: { label: 'Hoàn thành', color: 'var(--color-success)' },
  missed: { label: 'Nhỡ cuộc gọi', color: 'var(--color-danger)' },
};

export function WorkingPage() {
  const [activeCall, setActiveCall] = useState<number | null>(null);

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['call-tasks'],
    queryFn: async () => mockTasks,
  });

  const handleCall = (taskId: number, phone: string) => {
    setActiveCall(taskId);
    window.location.href = `tel:${phone}`;
    setTimeout(() => setActiveCall(null), 2000);
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <>
      <div className="stat-grid" style={{ marginBottom: 16 }}>
        <div className="stat-card">
          <div className="stat-card__value">
            {tasks?.filter((t) => t.status === 'pending').length ?? 0}
          </div>
          <div className="stat-card__label">Chờ gọi</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">
            {tasks?.filter((t) => t.status === 'completed').length ?? 0}
          </div>
          <div className="stat-card__label">Đã gọi</div>
        </div>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Danh sách khách hàng</h3>

      {tasks?.map((task) => (
        <div key={task.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{task.customerName}</div>
            <div style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>{task.phone}</div>
            <div style={{ fontSize: 12, color: statusConfig[task.status].color, marginTop: 4 }}>
              {statusConfig[task.status].label}
            </div>
            {task.note && (
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                {task.note}
              </div>
            )}
          </div>
          {task.status === 'pending' && (
            <Button
              variant="primary"
              size="sm"
              loading={activeCall === task.id}
              onClick={() => handleCall(task.id, task.phone)}
              style={{ width: 'auto', minWidth: 48 }}
            >
              <HiPhone size={20} />
            </Button>
          )}
          {task.status === 'completed' && (
            <HiPhoneIncoming size={24} color="var(--color-success)" />
          )}
          {task.status === 'missed' && (
            <HiPhoneMissedCall size={24} color="var(--color-danger)" />
          )}
        </div>
      ))}
    </>
  );
}
