import axios from 'axios';
import { API_BASE_URL, AUTH_ENDPOINTS, ROUTES, STORAGE_KEYS } from '@/constants';
import { SessionExpiredError, isSessionExpiredError } from '@/lib/auth/session-error';
import { queryClient } from '@/lib/query/client';
import { useAuthStore } from '@/stores/auth.store';
import type { ApiResponse, AuthTokens } from '@/types';
import { unwrapApiData } from '@/utils';
import { extractAuthTokens } from '@/utils/auth-response';

const EXPIRY_SKEW_MS = 30_000;

let redirecting = false;
let refreshPromise: Promise<string> | null = null;

export function isAccessTokenExpired(
  expiresAt: number | null = useAuthStore.getState().expiresAt,
  now = Date.now(),
): boolean {
  if (expiresAt == null) return false;
  return now >= expiresAt - EXPIRY_SKEW_MS;
}

export function expireSession(): void {
  if (redirecting) return;

  const { isAuthenticated, accessToken, refreshToken, clearAuth } = useAuthStore.getState();
  const hasSession = isAuthenticated || Boolean(accessToken) || Boolean(refreshToken);
  const loginUrl = `${ROUTES.LOGIN}?expired=1`;
  const here = `${window.location.pathname}${window.location.search}`;

  if (!hasSession && (window.location.pathname === ROUTES.LOGIN || here === loginUrl)) {
    return;
  }

  redirecting = true;
  clearAuth();
  queryClient.clear();

  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  } catch {
    // Trình duyệt có thể chặn storage ở chế độ riêng tư.
  }

  if (here === loginUrl) {
    redirecting = false;
    return;
  }

  window.location.replace(loginUrl);
}

export function isUnrecoverableRefreshError(error: unknown): boolean {
  if (isSessionExpiredError(error)) return true;
  if (!axios.isAxiosError(error)) return true;
  if (!error.response) return false;

  const status = error.response.status;
  return status === 400 || status === 401 || status === 403 || status === 422;
}

async function requestRefresh(): Promise<string> {
  const { refreshToken, setTokens } = useAuthStore.getState();

  if (!refreshToken) {
    throw new SessionExpiredError();
  }

  const { data } = await axios.post<ApiResponse<AuthTokens>>(
    `${API_BASE_URL}${AUTH_ENDPOINTS.REFRESH}`,
    { refresh_token: refreshToken },
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 20000,
    },
  );

  const tokens = extractAuthTokens(unwrapApiData(data));
  setTokens(tokens);
  return tokens.access_token;
}

export function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = requestRefresh().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

export async function refreshIfExpired(): Promise<boolean> {
  const { isAuthenticated, accessToken, refreshToken } = useAuthStore.getState();
  if (!isAuthenticated) return false;

  const expired = !accessToken || isAccessTokenExpired();
  if (!expired) return false;

  if (!refreshToken) {
    expireSession();
    throw new SessionExpiredError();
  }

  try {
    await refreshAccessToken();
    return true;
  } catch (error) {
    if (isUnrecoverableRefreshError(error)) {
      expireSession();
      throw new SessionExpiredError();
    }

    throw error;
  }
}
