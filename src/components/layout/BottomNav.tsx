import { NavLink } from 'react-router-dom';
import { HiHome, HiPhone, HiChartBar, HiUser } from 'react-icons/hi';
import { BOTTOM_NAV_ITEMS, ROUTES } from '@/constants';

const iconMap = {
  home: HiHome,
  phone: HiPhone,
  chart: HiChartBar,
  user: HiUser,
} as const;

export function BottomNav() {
  return (
    <nav
      className="safe-bottom fixed bottom-0 left-1/2 z-[200] flex h-16 w-full max-w-[480px] -translate-x-1/2 border-t border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/95"
      aria-label="Main navigation"
    >
      {BOTTOM_NAV_ITEMS.map((item) => {
        const Icon = iconMap[item.icon];
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === ROUTES.HOME}
            className={({ isActive }) =>
              [
                'flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors duration-150',
                isActive
                  ? 'text-primary'
                  : 'text-slate-500 dark:text-slate-400',
              ].join(' ')
            }
          >
            <Icon className="text-[22px]" aria-hidden="true" />
            <span className="leading-none">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
