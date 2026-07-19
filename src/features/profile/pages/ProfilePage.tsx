import { Link } from 'react-router-dom';
import {
  HiKey,
  HiMoon,
  HiSun,
  HiLogout,
  HiChevronRight,
  HiInformationCircle,
} from 'react-icons/hi';
import { useAuthStore, selectUser } from '@/stores/auth.store';
import { useTheme } from '@/hooks/useTheme';
import { useConfirmLogout } from '@/features/auth/hooks/useAuth';
import { getInitials } from '@/utils';
import { ROUTES, APP_NAME } from '@/constants';

export function ProfilePage() {
  const user = useAuthStore(selectUser);
  const { resolvedTheme, toggleTheme } = useTheme();
  const { confirmLogout, isPending } = useConfirmLogout();

  return (
    <>
      <div className="profile-header">
        <div className="profile-header__avatar">
          {user?.name ? getInitials(user.name) : 'U'}
        </div>
        <div className="profile-header__name">{user?.name || 'Người dùng'}</div>
        <div className="profile-header__email">{user?.email}</div>
        {user?.role && (
          <div
            style={{
              marginTop: 8,
              fontSize: 12,
              background: 'var(--color-primary)',
              color: '#fff',
              padding: '4px 12px',
              borderRadius: 12,
              display: 'inline-block',
            }}
          >
            {user.role}
          </div>
        )}
      </div>

      <div className="menu-list" style={{ marginBottom: 16 }}>
        <Link to={ROUTES.CHANGE_PASSWORD} className="menu-list__item">
          <HiKey />
          <span>Đổi mật khẩu</span>
          <HiChevronRight />
        </Link>
        <button type="button" className="menu-list__item w-full" onClick={toggleTheme}>
          {resolvedTheme === 'dark' ? <HiSun /> : <HiMoon />}
          <span className='text-left'>{resolvedTheme === 'dark' ? 'Chế độ sáng' : 'Chế độ tối'}</span>
          <HiChevronRight />
        </button>
      </div>

      <div className="menu-list" style={{ marginBottom: 16 }}>
        <div className="menu-list__item">
          <HiInformationCircle />
          <span>Phiên bản</span>
          <span style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>1.0.0</span>
        </div>
      </div>

      <div className="menu-list" style={{ marginBottom: 16 }}>
        <button
          type="button"
          className="menu-list__item menu-list__item--danger"
          onClick={confirmLogout}
          disabled={isPending}
          style={{ width: '100%' }}
        >
          <HiLogout />
          <span>{isPending ? 'Đang đăng xuất...' : 'Đăng xuất'}</span>
        </button>
      </div>

      <p
        style={{
          textAlign: 'center',
          fontSize: 12,
          color: 'var(--color-text-muted)',
          marginTop: 24,
        }}
      >
        {APP_NAME} © {new Date().getFullYear()}
      </p>
    </>
  );
}
