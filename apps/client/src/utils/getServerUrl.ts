import { defaultEnv } from '@repo/shared/api';

export function getServerUrl(): string {
  return import.meta.env.VITE_SERVER_URL || defaultEnv.SERVER_URL;
}
