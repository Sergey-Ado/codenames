import { describe, expect, it } from 'vitest';
import { getUserWithoutPassword } from '../../utils/getUserWithoutPassword.ts';
import { v4 as uuid } from 'uuid';

describe('getUserWithoutPassword', () => {
  it('return user without password', () => {
    const id = uuid();
    const username = 'username';
    const email = 'test@mail.com';
    const password = 'password';

    const user = { id, username, email, password };

    const output = getUserWithoutPassword(user);

    expect(output).toHaveProperty('id', id);
    expect(output).toHaveProperty('username', username);
    expect(output).toHaveProperty('email', email);
    expect(output).not.toHaveProperty('password');
  });
});
