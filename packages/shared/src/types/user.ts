import z from 'zod';
import { LoginInputSchema } from '../schemas/user';

export type LoginInput = z.infer<typeof LoginInputSchema>;
