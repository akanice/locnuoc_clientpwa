import type { AuthTokens, User } from '@/types';

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : null;
}

export function extractAuthTokens(payload: unknown): AuthTokens {
  const record = asRecord(payload);
  if (!record) {
    throw new Error('Phản hồi đăng nhập không hợp lệ');
  }

  const source = asRecord(record.token) ?? record;
  const accessToken = source.access_token;

  if (typeof accessToken !== 'string' || !accessToken) {
    throw new Error('Thiếu access_token');
  }

  return {
    access_token: accessToken,
    refresh_token: typeof source.refresh_token === 'string' ? source.refresh_token : '',
    token_type: typeof source.token_type === 'string' ? source.token_type : 'Bearer',
    expires_in: Number(source.expires_in) || 3600,
  };
}

export function extractUser(payload: unknown): User | null {
  const record = asRecord(payload);
  if (!record) return null;

  const user = asRecord(record.user);
  if (!user || typeof user.id !== 'number') return null;
  if (typeof user.email !== 'string') return null;

  return {
    id: user.id,
    name: typeof user.name === 'string' ? user.name : '',
    email: user.email,
    phone: typeof user.phone === 'string' ? user.phone : undefined,
    avatar: typeof user.avatar === 'string' ? user.avatar : undefined,
    role: typeof user.role === 'string' ? user.role : undefined,
  };
}
