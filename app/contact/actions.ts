'use server';

import {
  createServerValidate,
  initialFormState,
  ServerValidateError,
} from '@tanstack/react-form-nextjs';
import { contactFormSchema } from './schema';
import { formOpts } from '@/app/contact/form-options';
import { fetchMutation } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import type { Lead } from '@/app/domain/Lead';
import * as Sentry from '@sentry/nextjs';

const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: ({ value }) => {
    const raw = value as unknown as Record<string, unknown>;
    const parsed = {
      ...raw,
      newsletter: raw.newsletter === 'on',
    };
    const result = contactFormSchema.safeParse(parsed);
    if (!result.success) {
      // Log validation errors to Sentry
      Sentry.captureMessage('Form validation failed', {
        level: 'warning',
        extra: {
          validationErrors: result.error,
          formData: {
            hasFirstName: !!raw.firstName,
            hasLastName: !!raw.lastName,
            hasEmail: !!raw.email,
            hasPhone: !!raw.phone,
            apartmentType: raw.apartmentType,
            newsletter: raw.newsletter,
          },
        },
        tags: {
          formType: 'contact',
        },
      });

      // Map Zod issues to field-level error object
      return { serverError: 'Formulář má neplatná data' };
    }
  },
});

export async function submitContactForm(prev: unknown, formValues: FormData) {
  const transaction = Sentry.startSpan(
    {
      op: 'form.submit',
      name: 'Contact Form Submission',
    },
    async () => {
      try {
        // Log form submission attempt
        Sentry.addBreadcrumb({
          category: 'form',
          message: 'Contact form submission started',
          level: 'info',
        });

        const parsed = await serverValidate(formValues, {
          arrays: ['apartmentType'],
        } as never);

        const validatedData: Lead = {
          ...parsed,
          newsletter: (parsed.newsletter as unknown) === 'on',
        };

        // Log successful validation
        Sentry.addBreadcrumb({
          category: 'validation',
          message: 'Form validation successful',
          level: 'info',
        });

        // Start Convex mutation with monitoring
        try {
          await fetchMutation(api.leads.create, {
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            email: validatedData.email,
            phone: validatedData.phone,
            message: validatedData.message,
            apartmentType: validatedData.apartmentType,
            newsletter: validatedData.newsletter,
          });

          // Log successful submission
          Sentry.captureMessage('Contact form submitted successfully', {
            level: 'info',
            tags: {
              formType: 'contact',
              status: 'success',
            },
          });

          return { ...initialFormState, values: { ...validatedData }, success: true };
        } catch (convexError) {
          // Log Convex mutation failure with full context
          Sentry.captureException(convexError, {
            level: 'error',
            extra: {
              errorMessage: convexError instanceof Error ? convexError.message : 'Unknown error',
              errorStack: convexError instanceof Error ? convexError.stack : undefined,
              mutationPayload: {
                hasFirstName: !!validatedData.firstName,
                hasLastName: !!validatedData.lastName,
                hasEmail: !!validatedData.email,
                hasPhone: !!validatedData.phone,
                apartmentTypes: validatedData.apartmentType,
                newsletter: validatedData.newsletter,
                messageLength: validatedData.message?.length || 0,
              },
              mutationName: 'api.leads.create',
            },
            tags: {
              formType: 'contact',
              errorType: 'convex_mutation',
              status: 'failed',
            },
            contexts: {
              mutation: {
                api: 'convex',
                endpoint: 'api.leads.create',
                type: 'fetchMutation',
              },
            },
          });

          throw convexError;
        }
      } catch (e) {
        if (e instanceof ServerValidateError) {
          // Log server validation error
          Sentry.addBreadcrumb({
            category: 'validation',
            message: 'Server validation error',
            level: 'warning',
          });
          return e.formState;
        }

        // Log unexpected errors
        Sentry.captureException(e, {
          level: 'error',
          extra: {
            errorType: 'unexpected',
            errorMessage: e instanceof Error ? e.message : 'Unknown error',
          },
          tags: {
            formType: 'contact',
            errorType: 'unexpected',
            status: 'failed',
          },
        });

        return {
          values: initialFormState.values,
          errors: [{ serverError: 'Chyba serveru' }],
        };
      }
    }
  );

  return transaction;
}
