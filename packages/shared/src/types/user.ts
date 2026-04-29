import z from 'zod';
import { LoginInputSchema, RegisterInputSchema } from '../schemas/user';

export type LoginInput = z.infer<typeof LoginInputSchema>;

export type RegisterInput = z.infer<typeof RegisterInputSchema>;
