import { QueryClient } from '@tanstack/react-query';
import { isSessionExpiredError } from '@/lib/auth/session-error';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: (failureCount, error) => !isSessionExpiredError(error) && failureCount < 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
