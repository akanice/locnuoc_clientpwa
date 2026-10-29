import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, AUTH_ENDPOINTS } from '@/constants';
import {
  expireSession,
  isUnrecoverableRefreshError,
  refreshAccessToken,
  refreshIfExpired,
} from '@/lib/auth/session';
import { SessionExpiredError, isSessionExpiredError } from '@/lib/auth/session-error';
import { useAuthStore } from '@/stores/auth.store';
import { unwrapApiData } from '@/utils';

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

const isLoginRequest = (url?: string) => url?.includes(AUTH_ENDPOINTS.LOGIN) ?? false;
const isRefreshRequest = (url?: string) => url?.includes(AUTH_ENDPOINTS.REFRESH) ?? false;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (isLoginRequest(config.url) || isRefreshRequest(config.url)) {
    return config;
  }

  try {
    await refreshIfExpired();
  } catch (error) {
    return Promise.reject(error);
  }

  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    response.data = unwrapApiData(response.data);
    return response;
  },
  async (error: AxiosError) => {
    if (isSessionExpiredError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetryableRequest | undefined;
    if (!originalRequest || isLoginRequest(originalRequest.url)) {
      return Promise.reject(error);
    }

    const unauthorized = error.response?.status === 401;

    if (!unauthorized) {
      return Promise.reject(error);
    }

    if (originalRequest._retry || isRefreshRequest(originalRequest.url)) {
      expireSession();
      return Promise.reject(new SessionExpiredError());
    }

    originalRequest._retry = true;

    try {
      const token = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      if (isUnrecoverableRefreshError(refreshError)) {
        expireSession();
        return Promise.reject(new SessionExpiredError());
      }

      return Promise.reject(error);
    }
  },
);

export default apiClient;
