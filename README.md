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
# Cập nhật VITE_API_BASE_URL, VITE_OAUTH_* trong .env
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

## Backend Laravel Passport

Cấu hình OAuth Password Grant trên Laravel:

- `POST /oauth/token` — Login & Refresh token
- `GET /api/user` — Profile
- `POST /api/logout` — Logout
- `POST /api/password/email` — Forgot password
- `POST /api/password/reset` — Reset password
- `PUT /api/user/password` — Change password

## Biến môi trường

| Biến | Mô tả |
|------|-------|
| `VITE_API_BASE_URL` | Base URL API Laravel |
| `VITE_OAUTH_TOKEN_URL` | OAuth token endpoint |
| `VITE_OAUTH_CLIENT_ID` | Passport client ID |
| `VITE_OAUTH_CLIENT_SECRET` | Passport client secret |
