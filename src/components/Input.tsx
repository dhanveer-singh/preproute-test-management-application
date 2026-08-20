import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function Input({ label, error, id, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-3.5 block text-[16px] font-medium leading-5 text-[#344054]">
        {label}
      </label>

      <input
        id={id}
        className={`h-12 w-full rounded-lg border border-[#D0D5DD] bg-white px-4 text-[16px] text-[#344054] outline-none transition placeholder:text-[#D0D5DD] focus:border-[#5B8DEF] focus:ring-1 focus:ring-[#5B8DEF] ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
        } ${className}`}
        {...props}
      />

      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default Input;
