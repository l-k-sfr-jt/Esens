import { z } from 'zod';

export const apartmentTypeEnum = z.enum(["1+KK", "2+KK", "3+KK", "4+KK"]);

export const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Křestní jméno musí mít alespoň 2 znaky')
    .max(50, 'Křestní jméno může mít maximálně 50 znaků'),
  lastName: z
    .string()
    .min(2, 'Příjmení musí mít alespoň 2 znaky')
    .max(50, 'Příjmení může mít maximálně 50 znaků'),
  phone: z
    .string()
    .min(9, 'Telefonní číslo musí mít alespoň 9 číslic')
    .regex(
      /^(\+420)?[0-9]{9,}$/,
      'Zadejte platné telefonní číslo (např. 123456789 nebo +420123456789)'
    ),
  email: z.string().email('Zadejte platnou e-mailovou adresu').min(1, 'E-mail je povinný'),
  message: z.string().max(2000, 'Zpráva může mít maximálně 2000 znaků'),
  apartmentType: z.array(apartmentTypeEnum),
  newsletter: z.boolean()
});
