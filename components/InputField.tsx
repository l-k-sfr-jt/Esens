import React, { ChangeEvent, FocusEvent, useId } from 'react';
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
      <div className="flex justify-between gap-2">
        <label className="text-white" htmlFor={inputId}>
          {label}
          {isRequired && <span aria-hidden={true}>*</span>}
        </label>
        {errorMessage && (
          <p id={`error${randomId}`} className="text-red-400 text-right">
            {errorMessage}
          </p>
        )}
      </div>
      <input
        required={isRequired}
        id={inputId}
        name={name}
        type={htmlType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={clsx(
          'p-3 rounded-sm border-neutral-50 border text-neutral-50 placeholder:text-gray-400 hover:cursor-pointer hover:bg-white hover:text-gray-400 focus:text-gray-400 focus:bg-white',
          { 'border-red-400': hasError }
        )}
      />
    </div>
  );
}
