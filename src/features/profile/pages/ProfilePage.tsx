import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiKey,
  HiMoon,
  HiSun,
  HiLogout,
  HiChevronRight,
  HiInformationCircle,
  HiDatabase,
} from 'react-icons/hi';
import { useAuthStore, selectUser } from '@/stores/auth.store';
import { useTheme } from '@/hooks/useTheme';
import { useConfirmLogout } from '@/features/auth/hooks/useAuth';
import { ReceiveDataSettingsModal } from '@/features/profile/components/ReceiveDataSettingsModal';
import { getInitials } from '@/utils';
import { ROUTES, APP_NAME } from '@/constants';

const cardClass =
  'overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800';

const menuItemClass =
  'flex min-h-11 items-center gap-3 border-b border-slate-200 px-4 py-4 transition-colors active:bg-slate-50 dark:border-slate-700 dark:active:bg-slate-900 last:border-b-0';

export function ProfilePage() {
  const user = useAuthStore(selectUser);
  const { resolvedTheme, toggleTheme } = useTheme();
  const { confirmLogout, isPending } = useConfirmLogout();
  const [receiveDataSettingsOpen, setReceiveDataSettingsOpen] = useState(false);

  return (
    <>
      <div className={`${cardClass} mb-4 p-6 text-center`}>
        <div className="mx-auto mb-3 flex size-[72px] items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
          {user?.name ? getInitials(user.name) : 'U'}
        </div>
        <div className="text-lg font-semibold">{user?.name || 'Người dùng'}</div>
        <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user?.email}</div>
        {user?.role && (
          <div className="mt-2 inline-block rounded-xl bg-primary px-3 py-1 text-xs text-white">
            {user.role}
          </div>
        )}
      </div>

      <div className={`${cardClass} mb-4`}>
        <button
          type="button"
          className={`${menuItemClass} w-full`}
          onClick={() => setReceiveDataSettingsOpen(true)}
        >
          <HiDatabase className="text-xl text-slate-500 dark:text-slate-400" />
          <span className="flex-1 text-left text-[15px]">Cài đặt data sẽ nhận</span>
          <HiChevronRight className="text-slate-500 dark:text-slate-400" />
        </button>
      </div>

      <div className={`${cardClass} mb-4`}>
        <Link to={ROUTES.CHANGE_PASSWORD} className={menuItemClass}>
          <HiKey className="text-xl text-slate-500 dark:text-slate-400" />
          <span className="flex-1 text-[15px]">Đổi mật khẩu</span>
          <HiChevronRight className="text-slate-500 dark:text-slate-400" />
        </Link>
        <button type="button" className={`${menuItemClass} w-full`} onClick={toggleTheme}>
          {resolvedTheme === 'dark' ? (
            <HiSun className="text-xl text-slate-500 dark:text-slate-400" />
          ) : (
            <HiMoon className="text-xl text-slate-500 dark:text-slate-400" />
          )}
          <span className="flex-1 text-left text-[15px]">
            {resolvedTheme === 'dark' ? 'Chế độ sáng' : 'Chế độ tối'}
          </span>
          <HiChevronRight className="text-slate-500 dark:text-slate-400" />
        </button>
      </div>

      <div className={`${cardClass} mb-4`}>
        <div className={menuItemClass}>
          <HiInformationCircle className="text-xl text-slate-500 dark:text-slate-400" />
          <span className="flex-1 text-[15px]">Phiên bản</span>
          <span className="text-sm text-slate-500 dark:text-slate-400">1.0.0</span>
        </div>
      </div>

      <div className={`${cardClass} mb-4`}>
        <button
          type="button"
          className={`${menuItemClass} w-full text-danger`}
          onClick={confirmLogout}
          disabled={isPending}
        >
          <HiLogout className="text-xl text-danger" />
          <span className="flex-1 text-left text-[15px]">
            {isPending ? 'Đang đăng xuất...' : 'Đăng xuất'}
          </span>
        </button>
      </div>

      <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        {APP_NAME} © {new Date().getFullYear()}
      </p>

      <ReceiveDataSettingsModal
        open={receiveDataSettingsOpen}
        onClose={() => setReceiveDataSettingsOpen(false)}
      />
    </>
  );
}
