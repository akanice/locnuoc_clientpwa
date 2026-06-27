import { type ReactNode } from 'react';

interface AppShellProps {
  title?: string;
  headerAction?: ReactNode;
  showNav?: boolean;
  children: ReactNode;
}

export function AppShell({ title, headerAction, showNav = true, children }: AppShellProps) {
  return (
    <div className="app-shell">
      {title && (
        <header className="app-shell__header">
          <h1 className="app-shell__header-title">{title}</h1>
          {headerAction}
        </header>
      )}
      <main className={`app-shell__main ${!showNav ? 'app-shell__main--no-nav' : ''}`}>
        {children}
      </main>
    </div>
  );
}
