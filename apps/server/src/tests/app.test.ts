import { describe, expect, it } from 'vitest';

describe('app.ts', () => {
  it('export http.Server with listen method', async () => {
    const appModule = await import('../app.ts');
    const srv = appModule.default;
    expect(typeof srv.listen).toBe('function');
  });
});
