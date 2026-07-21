export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface LoginResponse extends AuthTokens {
  user?: User;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string | null;
  data: T;
  errors?: Record<string, string[]> | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export type ThemeMode = 'light' | 'dark' | 'system';
