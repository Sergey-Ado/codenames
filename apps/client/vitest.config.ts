import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      // reporter: ['text', 'json-summary', 'json'],
      include: ['src/**/*.{ts,tsx}'],
    },
    testTimeout: 20_000,
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@types': path.resolve(import.meta.dirname, './src/types'),
    },
  },
});
