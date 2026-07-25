export const APP_NAME = import.meta.env.VITE_APP_NAME || 'LocNuoc Telesales';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
} as const;

export const STORAGE_KEYS = {
  AUTH: 'locnuoc-auth',
  THEME: 'locnuoc-theme',
} as const;

export const ROUTES = {
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  CHANGE_PASSWORD: '/change-password',
  HOME: '/',
  WORKING: '/working',
  STATISTICS: '/statistics',
  STATISTICS_BY_PACKAGE: '/statistics/by-package',
  STATISTICS_CUSTOMER_HISTORY: '/statistics/customer-history',
  PROFILE: '/profile',
} as const;

export const BOTTOM_NAV_ITEMS = [
  { path: ROUTES.HOME, label: 'Trang chủ', icon: 'home' },
  { path: ROUTES.WORKING, label: 'Gọi điện', icon: 'phone' },
  { path: ROUTES.STATISTICS, label: 'Thống kê', icon: 'chart' },
] as const;
