import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="mb-4">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            'w-full rounded-xl border bg-white px-4 py-3 text-slate-900 transition-colors duration-150',
            'placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15',
            'dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400',
            error ? 'border-danger' : 'border-slate-200',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        {error && <span className="mt-1 block text-[13px] text-danger">{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
