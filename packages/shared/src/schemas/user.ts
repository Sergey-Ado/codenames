import z from 'zod';

export const LoginInputSchema = z.object({
  email: z.email('login.error.email'),
  password: z
    .string()
    .trim()
    .min(6, 'login.error.min')
    .regex(/[0-9]/, 'login.error.number')
    .regex(/[a-z]/i, 'login.error.letter')
    .regex(/[!@#$%^&*_+.,/]/, 'login.error.special'),
});
