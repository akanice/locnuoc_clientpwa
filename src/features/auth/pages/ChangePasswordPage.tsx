import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiEye, HiEyeOff, HiArrowLeft } from 'react-icons/hi';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from '@/features/auth/schemas/auth.schema';
import { useChangePassword } from '@/features/auth/hooks/useAuth';
import { ROUTES } from '@/constants';

export function ChangePasswordPage() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: '',
      password: '',
      password_confirmation: '',
    },
  });

  return (
    <div className="safe-top safe-bottom mx-auto flex min-h-dvh max-w-[480px] flex-col px-6 py-6">
      <div className="mb-4">
        <Link
          to={ROUTES.PROFILE}
          className="inline-flex items-center gap-2 px-2 py-2 text-slate-500 dark:text-slate-400"
        >
          <HiArrowLeft size={20} /> Quay lại
        </Link>
      </div>

      <div className="mb-8 text-center">
        <h1 className="mb-1 text-2xl font-bold">Đổi mật khẩu</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Cập nhật mật khẩu tài khoản của bạn
        </p>
      </div>

      <form
        className="flex-1"
        onSubmit={handleSubmit((data) => changePassword.mutate(data))}
        noValidate
      >
        <div className="mb-4">
          <label htmlFor="current_password" className="mb-1.5 block text-sm font-medium">
            Mật khẩu hiện tại
          </label>
          <div className="relative">
            <input
              id="current_password"
              type={showCurrent ? 'text' : 'password'}
              autoComplete="current-password"
              className={[
                'w-full rounded-xl border bg-white px-4 py-3 pr-11 transition-colors duration-150',
                'focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15',
                'dark:border-slate-600 dark:bg-slate-800',
                errors.current_password ? 'border-danger' : 'border-slate-200',
              ].join(' ')}
              {...register('current_password')}
            />
            <button
              type="button"
              className="absolute right-1 top-1/2 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center text-slate-500"
              onClick={() => setShowCurrent(!showCurrent)}
            >
              {showCurrent ? <HiEyeOff size={20} /> : <HiEye size={20} />}
            </button>
          </div>
          {errors.current_password && (
            <span className="mt-1 block text-[13px] text-danger">
              {errors.current_password.message}
            </span>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              id="password"
              type={showNew ? 'text' : 'password'}
              autoComplete="new-password"
              className={[
                'w-full rounded-xl border bg-white px-4 py-3 pr-11 transition-colors duration-150',
                'focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15',
                'dark:border-slate-600 dark:bg-slate-800',
                errors.password ? 'border-danger' : 'border-slate-200',
              ].join(' ')}
              {...register('password')}
            />
            <button
              type="button"
              className="absolute right-1 top-1/2 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center text-slate-500"
              onClick={() => setShowNew(!showNew)}
            >
              {showNew ? <HiEyeOff size={20} /> : <HiEye size={20} />}
            </button>
          </div>
          {errors.password && (
            <span className="mt-1 block text-[13px] text-danger">{errors.password.message}</span>
          )}
        </div>

        <Input
          label="Xác nhận mật khẩu mới"
          type="password"
          autoComplete="new-password"
          error={errors.password_confirmation?.message}
          {...register('password_confirmation')}
        />

        <Button type="submit" loading={changePassword.isPending}>
          Cập nhật mật khẩu
        </Button>
      </form>
    </div>
  );
}
