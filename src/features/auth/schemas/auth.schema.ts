import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email là bắt buộc')
    .email('Email không hợp lệ'),
  password: z
    .string()
    .min(1, 'Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email là bắt buộc')
    .email('Email không hợp lệ'),
});

export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email là bắt buộc')
      .email('Email không hợp lệ'),
    token: z.string().min(1, 'Token là bắt buộc'),
    password: z
      .string()
      .min(1, 'Mật khẩu là bắt buộc')
      .min(8, 'Mật khẩu tối thiểu 8 ký tự'),
    password_confirmation: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['password_confirmation'],
  });

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Mật khẩu hiện tại là bắt buộc'),
    password: z
      .string()
      .min(1, 'Mật khẩu mới là bắt buộc')
      .min(8, 'Mật khẩu tối thiểu 8 ký tự'),
    password_confirmation: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['password_confirmation'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
