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
    <div className="auth-page">
      <div style={{ marginBottom: 16 }}>
        <Link to={ROUTES.PROFILE} className="btn btn--ghost">
          <HiArrowLeft size={20} /> Quay lại
        </Link>
      </div>

      <div className="auth-page__header">
        <h1 className="auth-page__title">Đổi mật khẩu</h1>
        <p className="auth-page__subtitle">Cập nhật mật khẩu tài khoản của bạn</p>
      </div>

      <form
        className="auth-page__form"
        onSubmit={handleSubmit((data) => changePassword.mutate(data))}
        noValidate
      >
        <div className="form-group">
          <label htmlFor="current_password" className="form-label">
            Mật khẩu hiện tại
          </label>
          <div className="form-input-wrapper">
            <input
              id="current_password"
              type={showCurrent ? 'text' : 'password'}
              autoComplete="current-password"
              className={`form-input ${errors.current_password ? 'form-input--error' : ''}`}
              {...register('current_password')}
            />
            <button
              type="button"
              className="form-input-toggle"
              onClick={() => setShowCurrent(!showCurrent)}
            >
              {showCurrent ? <HiEyeOff size={20} /> : <HiEye size={20} />}
            </button>
          </div>
          {errors.current_password && (
            <span className="form-error">{errors.current_password.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Mật khẩu mới
          </label>
          <div className="form-input-wrapper">
            <input
              id="password"
              type={showNew ? 'text' : 'password'}
              autoComplete="new-password"
              className={`form-input ${errors.password ? 'form-input--error' : ''}`}
              {...register('password')}
            />
            <button
              type="button"
              className="form-input-toggle"
              onClick={() => setShowNew(!showNew)}
            >
              {showNew ? <HiEyeOff size={20} /> : <HiEye size={20} />}
            </button>
          </div>
          {errors.password && (
            <span className="form-error">{errors.password.message}</span>
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
