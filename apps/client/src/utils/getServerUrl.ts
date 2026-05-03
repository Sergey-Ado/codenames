import { defaultEnv } from '@repo/shared/api';

export function getServerUrl() {
  return import.meta.env.VITE_SERVER_URL || defaultEnv.SERVER_URL;
}
