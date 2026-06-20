import { describe, expect, it } from 'vitest';
import { getServerUrl } from './getServerUrl';
import { defaultEnv } from '@repo/shared/api';

describe('getServerUrl', () => {
  it('return SERVER_URL', () => {
    delete import.meta.env.VITE_SERVER_URL;
    import.meta.env.VITE_SERVER_URL = 'custom_url';

    const serverUrl = getServerUrl();

    expect(serverUrl).toBe('custom_url');
  });

  it('takes the serverUrl from defaultEnv by default if VITE_SERVER_URL is not specified', () => {
    delete import.meta.env.VITE_SERVER_URL;

    const serverUrl = getServerUrl();

    expect(serverUrl).toBe(defaultEnv.SERVER_URL);
  });
});
