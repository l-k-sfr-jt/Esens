'use client';

import { InputField } from '@/components/InputField';
import { TextArea } from '@/components/TextArea';
import { Button } from '@/components/Button';
import { ApartmentTypeSelector } from '@/components/ApartmentTypeSelector';
import { initialFormState, mergeForm, useForm, useTransform } from '@tanstack/react-form-nextjs';
import { formOpts } from '@/app/contact/form-options';
import { useActionState, useEffect } from 'react';
import { submitContactForm } from '@/app/contact/actions';
import { Checkbox } from '@/components/Checkbox';
import * as Sentry from '@sentry/nextjs';

export function Form() {
  const [state, action, isLoading] = useActionState(submitContactForm, initialFormState);
  const isSuccess =
    state.values && Object.keys(state.values).length > 0 && state.errors.length === 0;
  const serverErrors = state.errors[0]?.serverError;

  const form = useForm({
    ...formOpts,
    transform: useTransform((baseForm) => mergeForm(baseForm, state!), [state]),
  });

  // Log form initialization
  useEffect(() => {
    Sentry.addBreadcrumb({
      category: 'form',
      message: 'Contact form component mounted',
      level: 'info',
    });
  }, []);

  // Log form state changes
  useEffect(() => {
    if (isSuccess) {
      Sentry.addBreadcrumb({
        category: 'form',
        message: 'Form submission successful',
        level: 'info',
      });
    }

    if (serverErrors) {
      Sentry.captureMessage('Form submission failed with server error', {
        level: 'error',
        extra: {
          serverError: serverErrors,
          formState: {
            hasValues: !!state.values,
            errorCount: state.errors.length,
          },
        },
        tags: {
          formType: 'contact',
          errorLocation: 'client',
        },
      });
    }
  }, [isSuccess, serverErrors, state.values, state.errors.length]);

  return (
    <form
      aria-label="Kontaktní formulář"
      action={action}
      onSubmit={() => {
        Sentry.addBreadcrumb({
          category: 'form',
          message: 'Form submit button clicked',
          level: 'info',
        });
        form.handleSubmit();
      }}
      className="grid lg:grid-cols-2 lg:gap-y-4 gap-y-5 gap-x-5"
    >
      <form.Field name="firstName">
        {(field) => {
          const error = field.state.meta.errors[0];
          const errorMessage = typeof error === 'string' ? error : error?.message;

          return (
            <InputField
              htmlType="text"
              label="Křestní jméno"
              placeholder="Vaše jméno"
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              hasError={!!errorMessage}
              errorMessage={errorMessage}
              isRequired
            />
          );
        }}
      </form.Field>

      <form.Field name="lastName">
        {(field) => {
          const error = field.state.meta.errors[0];
          const errorMessage = typeof error === 'string' ? error : error?.message;

          return (
            <InputField
              htmlType="text"
              label="Příjmení"
              placeholder="Vaše příjmení"
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              hasError={!!errorMessage}
              errorMessage={errorMessage}
              isRequired
            />
          );
        }}
      </form.Field>

      <form.Field name="phone">
        {(field) => {
          const error = field.state.meta.errors[0];
          const errorMessage = typeof error === 'string' ? error : error?.message;

          return (
            <InputField
              htmlType="text"
              label="Telefonní číslo"
              placeholder="Vaše telefonní číslo"
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              hasError={!!errorMessage}
              errorMessage={errorMessage}
              isRequired
            />
          );
        }}
      </form.Field>

      <form.Field name="email">
        {(field) => {
          const error = field.state.meta.errors[0];
          const errorMessage = typeof error === 'string' ? error : error?.message;

          return (
            <InputField
              htmlType="email"
              label="E-mail"
              placeholder="Váš e-mail"
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              hasError={!!errorMessage}
              errorMessage={errorMessage}
              isRequired
            />
          );
        }}
      </form.Field>

      <form.Field name="message">
        {(field) => {
          const error = field.state.meta.errors[0];
          const errorMessage = typeof error === 'string' ? error : error?.message;

          return (
            <TextArea
              label="Zpráva"
              placeholder="Jak vám můžeme pomoci?"
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              hasError={!!errorMessage}
              errorMessage={errorMessage}
            />
          );
        }}
      </form.Field>
      <div className="col-span-full">
        <form.Field name="apartmentType" mode="array">
          {(field) => {
            return (
              <ApartmentTypeSelector
                className="pb-6"
                label="O jaký byt máte zájem?"
                onChange={(vals) => field.setValue(vals)}
                value={field.state.value}
                options={[
                  { value: '1+KK', label: '1+KK' },
                  { value: '2+KK', label: '2+KK' },
                  { value: '3+KK', label: '3+KK' },
                  { value: '4+KK', label: '4+KK' },
                ]}
              />
            );
          }}
        </form.Field>
        <form.Field name="newsletter">
          {(field) => {
            return (
              <Checkbox
                className="pb-2"
                onChange={(e) => field.handleChange(e.target.checked)}
                value={field.state.value}
                name="newsletter"
                label="Chci být součástí newsletteru Daramis a získávat všechny novinky a informace. "
              />
            );
          }}
        </form.Field>
        <Checkbox
          isRequired
          label={
            <>
              Odesláním formuláře souhlasíte se zpracováním{' '}
              <a href="#" className="underline underline-offset-4">
                zásad ochrany osobních údajů.
              </a>
            </>
          }
        />
      </div>
      <div className="flex items-center gap-4 col-span-full pt-6">
        <Button
          htmlType="submit"
          style={isSuccess ? 'success' : 'primary'}
          className=""
          isLoading={isLoading}
          disabled={isLoading}
        >
          {!isSuccess && 'Odeslat'}
          {isSuccess && 'DĚKUJEME ZA ODESLÁNÍ FORMULÁŘE!'}
        </Button>

        {serverErrors && (
          <p className="text-red-400 uppercase">
            Něco se pokazilo. <br />
            Zkuste to prosím znovu.
          </p>
        )}
      </div>
    </form>
  );
}
