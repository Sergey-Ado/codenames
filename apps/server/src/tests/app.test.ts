import { describe, expect, it } from 'vitest';

describe('app.ts', () => {
  it('export http.Server with listen method', async () => {
    const srv = (await import('../app.ts')).default;
    expect(typeof srv.listen).toBe('function');
  });
});
