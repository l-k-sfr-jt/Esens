import {apartmentTypeEnum} from "@/app/contact/schema";
import { z } from 'zod';

export type ApartmentType = z.infer<typeof apartmentTypeEnum>;
