import type { ChangeEvent, FocusEvent } from 'react';
import { useId } from 'react';

interface TextAreaProps {
  label: string;
  placeholder?: string;
  isRequired?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  id?: string;
  name?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
}

export function TextArea({
  id,
  label,
  placeholder,
  isRequired,
  hasError,
  errorMessage,
  name,
  value,
  onChange,
  onBlur,
}: TextAreaProps) {
  const randomId = useId();
  const inputId = id ?? randomId;

  return (
    <div className="grid gap-3 col-span-full">
      <div className="flex justify-between gap-2">
        <label htmlFor={inputId} className="text-white">
          {label}
          {isRequired && <span aria-hidden>*</span>}
        </label>
        {errorMessage && (
          <p id={`error${randomId}`} className="text-red-400 text-right">
            {errorMessage}
          </p>
        )}
      </div>
      <textarea
        id={inputId}
        name={name}
        required={isRequired}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`p-3 bg-transparent border border-neutral-50 text-neutral-50 placeholder:text-gray-400 hover:bg-white hover:text-gray-400 focus:text-gray-400 focus:bg-white ${hasError ? 'border-red-400' : ''}`}
        rows={5}
      ></textarea>
    </div>
  );
}
