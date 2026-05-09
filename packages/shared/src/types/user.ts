import z from 'zod';
import {
  LoginInputSchema,
  RegisterInputSchema,
  UserOutputSchema,
} from '../schemas/user.ts';

export type LoginInput = z.infer<typeof LoginInputSchema>;

export type RegisterInput = z.infer<typeof RegisterInputSchema>;

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
}

export type UserOutput = z.infer<typeof UserOutputSchema>;
