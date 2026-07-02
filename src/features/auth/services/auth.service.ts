import axios from 'axios';
import { apiClient } from '@/lib/axios/client';
import { API_BASE_URL, AUTH_ENDPOINTS } from '@/constants';
import type { LoginResponse, User } from '@/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

const jsonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
} as const;

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse & { user: User }> {
    const { data } = await axios.post<LoginResponse & { user: User }>(
      `${API_BASE_URL}${AUTH_ENDPOINTS.LOGIN}`,
      {
        email: payload.email,
        password: payload.password,
      },
      { headers: jsonHeaders },
    );

    return data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/logout');
    } catch {
      // Ignore logout errors — token may already be invalid
    }
  },

  async getProfile(): Promise<User> {
    const { data } = await apiClient.get<User>('/user');
    return data;
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>('/password/email', payload);
    return data;
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>('/password/reset', payload);
    return data;
  },

  async changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
    const { data } = await apiClient.put<{ message: string }>('/user/password', payload);
    return data;
  },
};
