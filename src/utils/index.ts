import axios from 'axios';
import type { AxiosError } from 'axios';
import type { ApiError, ApiResponse } from '@/types';

export function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    'data' in value
  );
}

export function unwrapApiData<T>(value: T | ApiResponse<T>): T {
  if (isApiResponse<T>(value)) {
    return value.data;
  }

  return value;
}

export function getErrorMessage(error: unknown, fallback = 'Đã xảy ra lỗi'): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    const data = axiosError.response?.data;

    if (data?.message) {
      return data.message;
    }

    if (data?.errors) {
      const firstError = Object.values(data.errors)[0];
      if (firstError?.[0]) {
        return firstError[0];
      }
    }

    if (axiosError.message) {
      return axiosError.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function hideSplashScreen(): void {
  const splash = document.getElementById('splash-screen');
  if (splash) {
    splash.classList.add('hidden');
    setTimeout(() => splash.remove(), 300);
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('vi-VN').format(value);
}
