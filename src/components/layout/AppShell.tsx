import { type ReactNode } from 'react';

interface AppShellProps {
  title?: string;
  headerAction?: ReactNode;
  showNav?: boolean;
  children: ReactNode;
}

export function AppShell({ title, headerAction, showNav = true, children }: AppShellProps) {
  return (
    <div className="relative mx-auto flex min-h-dvh max-w-[480px] flex-col bg-slate-50 dark:bg-slate-900">
      {title && (
        <header className="safe-top sticky top-0 z-[100] flex h-14 items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/95">
          <h1 className="flex-1 text-lg font-semibold">{title}</h1>
          {headerAction}
        </header>
      )}
      <main
        className={[
          'flex-1 overflow-y-auto [-webkit-overflow-scrolling:touch]',
          showNav
            ? 'pb-[calc(64px+env(safe-area-inset-bottom,0px)+16px)]'
            : 'pb-[calc(env(safe-area-inset-bottom,0px)+16px)]',
        ].join(' ')}
      >
        {children}
      </main>
    </div>
  );
}
