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
    <div className="safe-top safe-bottom mx-auto grid content-center flex min-h-dvh max-w-[480px] flex-col px-6 py-6">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-[72px] items-center justify-center rounded-3xl bg-primary text-[28px] font-bold text-white">
          LN
        </div>
        <h1 className="mb-1 text-2xl font-bold">{APP_NAME}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Đăng nhập để bắt đầu làm việc
        </p>
      </div>

      <form
        className="flex-1"
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

        <div className="mb-4">
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              className={[
                'w-full rounded-xl border bg-white px-4 py-3 pr-11 text-slate-900 transition-colors duration-150',
                'placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15',
                'dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100',
                errors.password ? 'border-danger' : 'border-slate-200',
              ].join(' ')}
              {...register('password')}
            />
            <button
              type="button"
              className="absolute right-1 top-1/2 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center text-slate-500 dark:text-slate-400"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
            </button>
          </div>
          {errors.password && (
            <span className="mt-1 block text-[13px] text-danger">{errors.password.message}</span>
          )}
        </div>

        <div className="mb-6 text-right">
          <Link to={ROUTES.FORGOT_PASSWORD} className="font-semibold text-primary">
            Quên mật khẩu?
          </Link>
        </div>

        <Button type="submit" loading={login.isPending}>
          Đăng nhập
        </Button>
      </form>
    </div>
  );
}
