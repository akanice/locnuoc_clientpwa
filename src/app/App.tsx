import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AppProviders } from '@/app/providers/AppProviders';
import { router } from '@/app/router';

export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="colored"
        limit={3}
        style={{ top: 'calc(env(safe-area-inset-top, 0px) + 16px)' }}
      />
    </AppProviders>
  );
}
