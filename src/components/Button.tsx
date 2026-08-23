import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
}

function Button({
  children,
  loading = false,
  disabled = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`flex h-12 w-full items-center justify-center rounded-lg bg-[#5B8DEF] px-5 text-[16px] font-medium text-white transition-colors hover:bg-[#4F82E5] focus:outline-none focus:ring-2 focus:ring-[#5B8DEF]/20 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}

export default Button;
