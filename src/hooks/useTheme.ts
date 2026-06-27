import { useEffect } from 'react';
import { useThemeStore, selectThemeMode, selectResolvedTheme } from '@/stores/theme.store';

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const mode = useThemeStore(selectThemeMode);
  const resolvedTheme = useThemeStore(selectResolvedTheme);
  const setMode = useThemeStore((s) => s.setMode);
  const setResolvedTheme = useThemeStore((s) => s.setResolvedTheme);

  useEffect(() => {
    const resolved = mode === 'system' ? getSystemTheme() : mode;
    setResolvedTheme(resolved);
    document.documentElement.setAttribute('data-theme', resolved);

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', resolved === 'dark' ? '#1e293b' : '#2563eb');
    }
  }, [mode, setResolvedTheme]);

  useEffect(() => {
    if (mode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      const resolved = e.matches ? 'dark' : 'light';
      setResolvedTheme(resolved);
      document.documentElement.setAttribute('data-theme', resolved);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [mode, setResolvedTheme]);

  const toggleTheme = () => {
    const next = resolvedTheme === 'light' ? 'dark' : 'light';
    setMode(next);
  };

  return { mode, resolvedTheme, setMode, toggleTheme };
}
