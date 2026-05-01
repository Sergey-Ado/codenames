import { describe, expect, it } from 'vitest';
describe('app.ts', () => {
    it('export http.Server with listen method', async () => {
        const srv = (await import("../app.js")).default;
        expect(typeof srv.listen).toBe('function');
    });
});
