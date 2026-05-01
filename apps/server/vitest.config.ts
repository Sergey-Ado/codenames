import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: 'src',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'json'],
      include: ['./**/*.{ts,tsx}'],
      exclude: ['types'],
    },
  },
});
