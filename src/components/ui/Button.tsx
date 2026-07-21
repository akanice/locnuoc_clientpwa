import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'md' | 'sm';
  loading?: boolean;
  children: ReactNode;
}

const variantClasses = {
  primary:
    'bg-primary text-white hover:bg-primary-dark active:scale-[0.98] disabled:opacity-60',
  secondary:
    'bg-transparent text-primary border border-primary hover:bg-primary/5',
  ghost: 'bg-transparent text-slate-500 dark:text-slate-400 w-auto px-2 py-2',
  danger: 'bg-danger text-white hover:bg-red-700 disabled:opacity-60',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150',
        'min-h-11 min-w-11',
        size === 'sm' ? 'px-4 py-2 text-sm min-h-9' : 'px-6 py-3 text-[15px] w-full',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Đang xử lý...' : children}
    </button>
  );
}
