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
    <div className="safe-top safe-bottom mx-auto flex min-h-dvh max-w-[480px] flex-col px-6 py-6">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-[72px] items-center justify-center rounded-3xl bg-primary text-[28px] font-bold text-white">
          LN
        </div>
        <h1 className="mb-1 text-2xl font-bold">Đặt lại mật khẩu</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Nhập mật khẩu mới cho tài khoản
        </p>
      </div>

      <form
        className="flex-1"
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

      <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        <Link to={ROUTES.LOGIN} className="font-semibold text-primary">
          ← Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}
