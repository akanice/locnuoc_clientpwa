import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from '@/features/auth/schemas/auth.schema';
import { useResetPassword } from '@/features/auth/hooks/useAuth';
import { ROUTES } from '@/constants';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const resetPassword = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: searchParams.get('email') || '',
      token: searchParams.get('token') || '',
      password: '',
      password_confirmation: '',
    },
  });

  return (
    <div className="auth-page">
      <div className="auth-page__header">
        <div className="auth-page__logo">LN</div>
        <h1 className="auth-page__title">Đặt lại mật khẩu</h1>
        <p className="auth-page__subtitle">Nhập mật khẩu mới cho tài khoản</p>
      </div>

      <form
        className="auth-page__form"
        onSubmit={handleSubmit((data) => resetPassword.mutate(data))}
        noValidate
      >
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Mật khẩu mới"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Xác nhận mật khẩu"
          type="password"
          autoComplete="new-password"
          error={errors.password_confirmation?.message}
          {...register('password_confirmation')}
        />

        <Button type="submit" loading={resetPassword.isPending}>
          Đặt lại mật khẩu
        </Button>
      </form>

      <div className="auth-page__footer">
        <Link to={ROUTES.LOGIN}>← Quay lại đăng nhập</Link>
      </div>
    </div>
  );
}
