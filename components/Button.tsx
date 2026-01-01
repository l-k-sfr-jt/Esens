import React from 'react';
import { LoadingIcon } from '@/components/LoadingIcon';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

interface ButtonProps {
  htmlType: 'button' | 'submit';
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
  style: 'primary' | 'success';
}

export function Button({
  htmlType,
  children,
  className,
  disabled = false,
  style = 'primary',
  isLoading = false,
}: ButtonProps) {
  return (
    <button
      type={htmlType}
      disabled={disabled}
      className={twMerge(
        clsx(
          'relative py-4 px-8 text-xs rounded-full border uppercase enabled:hover:cursor-pointer',
          {
            'bg-accent border-accent hover:text-neutral-50 text-primary enabled:hover:bg-primary enabled:hover:border-neutral-50':
              style === 'primary',
            'bg-green-400 border-green-400 text-neutral-50': style === 'success',
          },
          className
        )
      )}
    >
      <span className={isLoading ? 'invisible' : 'visible'}>{children}</span>
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <LoadingIcon />
        </span>
      )}
    </button>
  );
}
