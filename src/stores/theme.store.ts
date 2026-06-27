import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode } from '@/types';
import { STORAGE_KEYS } from '@/constants';

interface ThemeState {
  mode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  setResolvedTheme: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      resolvedTheme: 'light',
      setMode: (mode) => set({ mode }),
      setResolvedTheme: (resolvedTheme) => set({ resolvedTheme }),
    }),
    {
      name: STORAGE_KEYS.THEME,
      partialize: (state) => ({ mode: state.mode }),
    },
  ),
);

export const selectThemeMode = (state: ThemeState) => state.mode;
export const selectResolvedTheme = (state: ThemeState) => state.resolvedTheme;
