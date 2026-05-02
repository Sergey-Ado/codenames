import { User } from '@repo/shared/user';

export function getUserWithoutPassword(user: User): Omit<User, 'password'> {
  const { id, email, name } = user;

  return { id, email, name };
}
