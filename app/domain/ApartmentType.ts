import type { apartmentTypeEnum } from '@/app/contact/schema';
import type { z } from 'zod';

export type ApartmentType = z.infer<typeof apartmentTypeEnum>;
