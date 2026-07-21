export function LoadingScreen() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 text-slate-500 dark:text-slate-400">
      <div className="size-8 animate-spin-slow rounded-full border-[3px] border-slate-200 border-t-primary dark:border-slate-600 dark:border-t-primary-light" />
      <span>Đang tải...</span>
    </div>
  );
}
