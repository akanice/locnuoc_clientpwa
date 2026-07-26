import { useCallback, useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type InstallResult = 'accepted' | 'dismissed' | 'unavailable' | 'ios' | 'installed';

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function isStandaloneDisplay(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator &&
      (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

function isIosDevice(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    notifyListeners();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    notifyListeners();
  });
}

export function usePwaInstall() {
  const [, setTick] = useState(0);
  const [isInstalled, setIsInstalled] = useState(() =>
    typeof window !== 'undefined' ? isStandaloneDisplay() : false,
  );

  useEffect(() => {
    const onChange = () => setTick((n) => n + 1);
    listeners.add(onChange);
    setIsInstalled(isStandaloneDisplay());
    return () => {
      listeners.delete(onChange);
    };
  }, []);

  const install = useCallback(async (): Promise<InstallResult> => {
    if (isStandaloneDisplay()) {
      setIsInstalled(true);
      return 'installed';
    }

    if (isIosDevice()) {
      return 'ios';
    }

    if (!deferredPrompt) {
      return 'unavailable';
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    notifyListeners();

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }

    return outcome;
  }, []);

  return {
    canInstall: !!deferredPrompt,
    isInstalled,
    isIos: typeof window !== 'undefined' ? isIosDevice() : false,
    install,
  };
}
