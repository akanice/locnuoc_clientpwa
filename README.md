# LocNuoc Telesales PWA

Ứng dụng PWA dành cho nhân viên telesales, tối ưu cho thao tác một tay trên điện thoại (Android/iPhone).

## Công nghệ

- React 19 + TypeScript
- Vite + Vite PWA Plugin
- React Router DOM
- TanStack Query + Zustand
- Axios (Laravel Passport OAuth2)
- React Hook Form + Zod
- SCSS (Mobile First)
- React Toastify + SweetAlert2 + DayJS

## Tính năng

- PWA installable (Add to Home Screen)
- Offline splash screen + Service Worker cache
- Dark Mode
- Pull to Refresh
- Loading Skeleton
- App Shell Architecture
- Authentication (Login, Logout, Forgot/Reset/Change Password)
- Auto refresh token + Route Guard + Persist login
- Bottom Navigation (Home, Working, Statistics, Profile)

## Cài đặt

```bash
cd locnuoc_clientpwa
npm install
cp .env.example .env
# Cập nhật VITE_API_BASE_URL trong .env
npm run dev
```

## Build production

```bash
npm run build
npm run preview
```

## Cấu trúc thư mục

```
src/
├── app/           # App shell, providers, router
├── components/    # UI components dùng chung
├── constants/     # Hằng số, routes
├── features/      # Feature modules (auth, home, working...)
├── hooks/         # Custom hooks
├── lib/           # Axios, Query client
├── stores/        # Zustand stores
├── styles/        # SCSS global
├── types/         # TypeScript types
└── utils/         # Utility functions
```

## Backend Laravel API

PWA gọi API Laravel qua `VITE_API_BASE_URL`. OAuth Passport (`PASSPORT_PASSWORD_CLIENT_ID`, `PASSPORT_PASSWORD_CLIENT_SECRET`) chỉ dùng phía server.

| Endpoint | Mô tả |
|----------|-------|
| `POST /auth/login` | Đăng nhập — trả `access_token`, `refresh_token`, `user` |
| `POST /auth/refresh` | Làm mới token — body: `{ refresh_token }` |
| `GET /user` | Profile |
| `POST /logout` | Đăng xuất |
| `POST /password/email` | Quên mật khẩu |
| `POST /password/reset` | Đặt lại mật khẩu |
| `PUT /user/password` | Đổi mật khẩu |

## Biến môi trường

| Biến | Mô tả |
|------|-------|
| `VITE_APP_NAME` | Tên ứng dụng |
| `VITE_API_BASE_URL` | Base URL API Laravel (vd: `https://domain.com/api/v1`) |
