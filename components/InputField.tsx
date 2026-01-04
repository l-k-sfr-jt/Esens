import type { ChangeEvent, FocusEvent } from 'react';
import React, { useId } from 'react';
import { clsx } from 'clsx';

export interface InputFieldProps {
  htmlType: 'text' | 'password' | 'email';
  placeholder?: string;
  label: string;
  name: string;
  isRequired?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  id?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
}
export function InputField({
  id,
  name,
  label,
  placeholder,
  htmlType,
  hasError,
  errorMessage,
  isRequired = false,
  value,
  onChange,
  onBlur,
}: InputFieldProps) {
  const randomId = useId();
  const inputId = id ?? randomId;
  return (
    <div className="grid gap-3">
      <div className="flex justify-between gap-1">
        <label className="text-white flex gap-1" htmlFor={inputId}>
          {label}
          {isRequired && (
            <abbr title="required" className="no-underline">
              *
            </abbr>
          )}
        </label>
        {errorMessage && (
          <p id={`error_${randomId}`} className="text-red-400 text-right">
            {errorMessage}
          </p>
        )}
      </div>
      <input
        aria-invalid={hasError}
        aria-errormessage={`error_${randomId}`}
        required={isRequired}
        id={inputId}
        name={name}
        type={htmlType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={clsx(
          'p-3 rounded-sm max-h-13 border-neutral-50 border self-end text-neutral-50 placeholder:text-gray-400 hover:cursor-pointer hover:bg-white hover:text-gray-400 focus:text-gray-400 focus:bg-white',
          { 'border-red-400': hasError }
        )}
      />
    </div>
  );
}
