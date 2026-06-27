import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { loginSchema, type LoginFormData } from '@/features/auth/schemas/auth.schema';
import { useLogin } from '@/features/auth/hooks/useAuth';
import { ROUTES, APP_NAME } from '@/constants';

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <div className="auth-page">
      <div className="auth-page__header">
        <div className="auth-page__logo">LN</div>
        <h1 className="auth-page__title">{APP_NAME}</h1>
        <p className="auth-page__subtitle">Đăng nhập để bắt đầu làm việc</p>
      </div>

      <form
        className="auth-page__form"
        onSubmit={handleSubmit((data) => login.mutate(data))}
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

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Mật khẩu
          </label>
          <div className="form-input-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              className={`form-input ${errors.password ? 'form-input--error' : ''}`}
              {...register('password')}
            />
            <button
              type="button"
              className="form-input-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
            </button>
          </div>
          {errors.password && (
            <span className="form-error">{errors.password.message}</span>
          )}
        </div>

        <div style={{ textAlign: 'right', marginBottom: 24 }}>
          <Link to={ROUTES.FORGOT_PASSWORD}>Quên mật khẩu?</Link>
        </div>

        <Button type="submit" loading={login.isPending}>
          Đăng nhập
        </Button>
      </form>
    </div>
  );
}
