import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mainRender, setGlobalStyles } from './main';

beforeEach(() => {
  vi.resetModules();
});

describe('main', () => {
  it('render without errors', async () => {
    expect(() => mainRender()).not.toThrow();
  });

  it('sets the correct theme on the document', async () => {
    localStorage.setItem('theme', 'dark');

    expect(() => setGlobalStyles()).not.toThrow();
  });
});
