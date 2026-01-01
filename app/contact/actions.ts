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
      // Map Zod issues to field-level error object
      return { serverError: 'Formulář má neplatná data' };
    }
  },
});

export async function submitContactForm(prev: unknown, formValues: FormData) {
  try {
    const parsed = await serverValidate(formValues, {
      arrays: ['apartmentType'],
    } as never);

    const validatedData: Lead = {
      ...parsed,
      newsletter: (parsed.newsletter as unknown) === 'on',
    };

    await fetchMutation(api.leads.create, {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      phone: validatedData.phone,
      message: validatedData.message,
      apartmentType: validatedData.apartmentType,
      newsletter: validatedData.newsletter,
    });

    return { ...initialFormState, values: { ...validatedData }, success: true };
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }

    return {
      values: initialFormState.values,
      errors: [{ serverError: 'Chyba serveru' }],
    };
  }
}
