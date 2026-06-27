import axios from 'axios';
import { apiClient } from '@/lib/axios/client';
import {
  OAUTH_TOKEN_URL,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
} from '@/constants';
import type { AuthTokens, LoginResponse, User } from '@/types';

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

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse & { user: User }> {
    const { data: tokens } = await axios.post<AuthTokens>(OAUTH_TOKEN_URL, {
      grant_type: 'password',
      client_id: OAUTH_CLIENT_ID,
      client_secret: OAUTH_CLIENT_SECRET,
      username: payload.email,
      password: payload.password,
      scope: '*',
    });

    const { data: user } = await axios.get<User>(`${import.meta.env.VITE_API_BASE_URL}/user`, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    return { ...tokens, user };
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
