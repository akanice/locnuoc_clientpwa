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
    <nav className="bottom-nav" aria-label="Main navigation">
      {BOTTOM_NAV_ITEMS.map((item) => {
        const Icon = iconMap[item.icon];
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === ROUTES.HOME}
            className={({ isActive }) =>
              `bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`
            }
          >
            <Icon aria-hidden="true" />
            <span className="bottom-nav__label">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
