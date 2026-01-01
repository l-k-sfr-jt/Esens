import type { contactFormSchema } from '@/app/contact/schema';
import type { z } from 'zod';

export type Lead = z.infer<typeof contactFormSchema>;
