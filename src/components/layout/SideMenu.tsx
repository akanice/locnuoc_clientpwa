import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';
import {
  HiChartBar,
  HiHome,
  HiPhone,
  HiUser,
  HiX,
} from 'react-icons/hi';
import { APP_NAME, ROUTES } from '@/constants';

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

const menuLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'flex min-h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-medium transition-colors',
    isActive
      ? 'bg-primary/10 text-primary'
      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700',
  ].join(' ');

const subMenuLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'flex min-h-10 items-center rounded-xl px-3 pl-11 text-sm font-medium transition-colors',
    isActive
      ? 'bg-primary/10 text-primary'
      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700',
  ].join(' ');

function isStatisticsPath(pathname: string) {
  return pathname === ROUTES.STATISTICS || pathname.startsWith(`${ROUTES.STATISTICS}/`);
}

export function SideMenu({ open, onClose }: SideMenuProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[300]">
      <div
        className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm animate-fade-in"
        aria-hidden
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal
        aria-label="Menu"
        className="absolute inset-y-0 left-0 flex w-[min(100%,320px)] flex-col border-r border-slate-200 bg-white shadow-2xl animate-drawer-in dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="safe-top flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-700">
          <span className="text-base font-semibold">{APP_NAME}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng menu"
            className="inline-flex size-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          >
            <HiX size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3" aria-label="Side menu">
          <NavLink to={ROUTES.HOME} end className={menuLinkClass} onClick={onClose}>
            <HiHome className="text-xl shrink-0" aria-hidden />
            Trang chủ
          </NavLink>

          <NavLink to={ROUTES.WORKING} className={menuLinkClass} onClick={onClose}>
            <HiPhone className="text-xl shrink-0" aria-hidden />
            Gọi điện
          </NavLink>

          <div className="mt-1">
            <div
              className={[
                'flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-[15px] font-medium',
                isStatisticsPath(pathname)
                  ? 'text-primary'
                  : 'text-slate-700 dark:text-slate-200',
              ].join(' ')}
            >
              <HiChartBar className="text-xl shrink-0" aria-hidden />
              <span className="flex-1 text-left">Thống kê</span>
            </div>

            <div className="mt-1 space-y-0.5">
              <NavLink
                to={ROUTES.STATISTICS}
                end
                className={subMenuLinkClass}
                onClick={onClose}
              >
                Tổng quan
              </NavLink>
              <NavLink
                to={ROUTES.STATISTICS_BY_PACKAGE}
                className={subMenuLinkClass}
                onClick={onClose}
              >
                Thống kê theo gói data
              </NavLink>
              <NavLink
                to={ROUTES.STATISTICS_AVAILABLE_CUSTOMERS}
                className={subMenuLinkClass}
                onClick={onClose}
              >
                Khách hàng khả dụng
              </NavLink>
            </div>
          </div>

          <NavLink to={ROUTES.PROFILE} className={menuLinkClass} onClick={onClose}>
            <HiUser className="text-xl shrink-0" aria-hidden />
            Cá nhân
          </NavLink>
        </nav>
      </aside>
    </div>,
    document.body,
  );
}
