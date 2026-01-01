import { jest } from '@jest/globals';
import { useState } from 'react';

export * from '@tanstack/react-form';

// Mock createServerValidate (server validator)
export function createServerValidate(opts: {
  onServerValidate?: (props: { value: unknown }) => unknown;
}) {
  return async (value: unknown) => {
    if (opts?.onServerValidate) {
      return opts.onServerValidate({ value });
    }
    return undefined;
  };
}

interface FormOptions {
  defaultValues?: Record<string, unknown>;
  [key: string]: unknown;
}

interface FormState {
  values: Record<string, unknown>;
  errors: Record<string, unknown>;
  meta: { touched: Record<string, boolean> };
}

export function useForm(opts: FormOptions) {
  const [formState, setFormState] = useState<FormState>({
    values: opts.defaultValues || {},
    errors: {},
    meta: { touched: {} },
  });

  interface FieldProps {
    name: string;
    children: (fieldState: unknown) => React.ReactNode;
    mode?: string;
  }

  function Field({ name, children, mode }: FieldProps) {
    const value = formState.values[name];
    const error = formState.errors[name];

    const fieldState = {
      name,
      state: {
        value: value || (mode === 'array' ? [] : ''),
        meta: {
          errors: error ? [error] : [],
        },
      },
      handleChange: (v: unknown) => {
        setFormState((prev) => ({
          ...prev,
          values: { ...prev.values, [name]: v },
        }));
      },
      handleBlur: () => {},
      setValue: (v: unknown) => {
        setFormState((prev) => ({
          ...prev,
          values: { ...prev.values, [name]: v },
        }));
      },
    };
    return children(fieldState);
  }

  interface SubscribeProps {
    selector: (state: { canSubmit: boolean; isSubmitting: boolean }) => [boolean, boolean];
    children: (state: [boolean, boolean]) => React.ReactNode;
  }

  function Subscribe({ selector, children }: SubscribeProps) {
    const [canSubmit, isSubmitting] = selector({ canSubmit: true, isSubmitting: false });
    return children([canSubmit, isSubmitting]);
  }

  return {
    ...opts,
    values: formState.values,
    errors: formState.errors,
    handleSubmit: jest.fn().mockImplementation(() => {}),
    Field,
    Subscribe,
    setValue: (name: string, value: unknown) => {
      setFormState((prev) => ({
        ...prev,
        values: { ...prev.values, [name]: value },
      }));
    },
    reset: () => {
      setFormState((prev) => ({
        ...prev,
        values: Object.keys(prev.values).reduce((acc, k) => ({ ...acc, [k]: '' }), {}),
        errors: {},
      }));
    },
  };
}

export function useTransform<T>(cb: T, _deps: unknown[]): T {
  return cb;
}

export function mergeForm<T extends Record<string, unknown>>(baseForm: T, newForm: Partial<T>): T {
  return { ...baseForm, ...newForm };
}

export const initialFormState = {
  values: {},
  errors: [],
  meta: {},
};

export class ServerValidateError extends Error {
  formState: { values: Record<string, unknown>; errors: unknown[] };
  constructor(formState: { values: Record<string, unknown>; errors: unknown[] }) {
    super('Server validation error');
    this.formState = formState;
  }
}
