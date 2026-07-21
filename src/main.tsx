import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { App } from '@/app/App';
import { hideSplashScreen } from '@/utils';
import '@/styles/index.css';
import 'react-toastify/dist/ReactToastify.css';

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Có phiên bản mới. Tải lại ứng dụng?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.info('App ready for offline use');
  },
});

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );

  requestAnimationFrame(() => {
    hideSplashScreen();
  });
}
