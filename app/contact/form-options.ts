import { formOptions, revalidateLogic } from '@tanstack/react-form-nextjs';
import { contactFormSchema } from '@/app/contact/schema';
import type { ApartmentType } from '@/app/domain/ApartmentType';

export const formOpts = formOptions({
  defaultValues: {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: '',
    apartmentType: [] as ApartmentType[],
    newsletter: false,
  },
  defaultProps: {},
  validationLogic: revalidateLogic({
    mode: 'submit',
    modeAfterSubmission: 'change',
  }),
  validators: {
    onDynamic: contactFormSchema,
  },
});
