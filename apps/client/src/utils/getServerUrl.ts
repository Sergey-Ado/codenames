import { defaultEnv } from '@repo/shared/api';

export function getServerUrl(): string {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return import.meta.env.VITE_SERVER_URL || defaultEnv.SERVER_URL;
}
