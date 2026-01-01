import {contactFormSchema} from "@/app/contact/schema";
import { z } from 'zod';

export type Lead = z.infer<typeof contactFormSchema>;
