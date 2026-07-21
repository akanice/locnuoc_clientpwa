import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@/features/auth/schemas/auth.schema';
import { useForgotPassword } from '@/features/auth/hooks/useAuth';
import { ROUTES } from '@/constants';

export function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  return (
    <div className="safe-top safe-bottom mx-auto flex min-h-dvh max-w-[480px] flex-col px-6 py-6">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-[72px] items-center justify-center rounded-3xl bg-primary text-[28px] font-bold text-white">
          LN
        </div>
        <h1 className="mb-1 text-2xl font-bold">Quên mật khẩu</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Nhập email để nhận link đặt lại mật khẩu
        </p>
      </div>

      <form
        className="flex-1"
        onSubmit={handleSubmit((data) => forgotPassword.mutate(data))}
        noValidate
      >
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="email@company.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Button type="submit" loading={forgotPassword.isPending}>
          Gửi link đặt lại
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
