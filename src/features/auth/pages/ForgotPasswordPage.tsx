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
    <div className="auth-page">
      <div className="auth-page__header">
        <div className="auth-page__logo">LN</div>
        <h1 className="auth-page__title">Quên mật khẩu</h1>
        <p className="auth-page__subtitle">
          Nhập email để nhận link đặt lại mật khẩu
        </p>
      </div>

      <form
        className="auth-page__form"
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

      <div className="auth-page__footer">
        <Link to={ROUTES.LOGIN}>← Quay lại đăng nhập</Link>
      </div>
    </div>
  );
}
