import type { ChangeEvent, FocusEvent } from 'react';
import React, { useId } from 'react';
import { clsx } from 'clsx';

interface CheckboxProps {
  label: string | React.ReactNode;
  id?: string;
  className?: string;
  isRequired?: boolean;
  name?: string;
  value?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
}

export function Checkbox({
  label,
  id,
  className,
  value,
  name,
  isRequired,
  onChange,
}: CheckboxProps) {
  const randomId = useId();
  const inputId = id ?? randomId;
  return (
    <div className={clsx('checkbox-item gap-2 flex items-center', className)}>
      <input
        type="checkbox"
        name={name}
        onChange={onChange}
        checked={value}
        className="cursor-pointer border appearance-none w-3 h-3 relative bg-primary accent-accent border-neutral-50 rounded-sm
        checked:after:content-['✓'] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:text-xs"
        id={inputId}
        required={isRequired}
      />
      <label htmlFor={inputId} className="cursor-pointer text-white text-xs">
        {label}
      </label>
    </div>
  );
}
