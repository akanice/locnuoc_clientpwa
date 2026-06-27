import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { authService } from '@/features/auth/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { queryClient } from '@/lib/query/client';
import { ROUTES } from '@/constants';
import { getErrorMessage } from '@/utils';
import type { LoginFormData } from '@/features/auth/schemas/auth.schema';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: ({ user, ...tokens }) => {
      setAuth(user, tokens);
      toast.success(`Xin chào, ${user.name}!`);
      navigate(ROUTES.HOME, { replace: true });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Đăng nhập thất bại'));
    },
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      navigate(ROUTES.LOGIN, { replace: true });
      toast.info('Đã đăng xuất');
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: (data) => {
      toast.success(data.message || 'Link đặt lại mật khẩu đã được gửi');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: (data) => {
      toast.success(data.message || 'Đặt lại mật khẩu thành công');
      navigate(ROUTES.LOGIN, { replace: true });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useChangePassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.changePassword,
    onSuccess: (data) => {
      toast.success(data.message || 'Đổi mật khẩu thành công');
      navigate(ROUTES.PROFILE, { replace: true });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useConfirmLogout() {
  const logout = useLogout();

  const confirmLogout = async () => {
    const result = await Swal.fire({
      title: 'Đăng xuất?',
      text: 'Bạn có chắc muốn đăng xuất khỏi ứng dụng?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đăng xuất',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#dc2626',
    });

    if (result.isConfirmed) {
      logout.mutate();
    }
  };

  return { confirmLogout, isPending: logout.isPending };
}
