import { describe, expect, it } from 'vitest';
import { Header } from '../../../app/components/header/Header';
import { JSX } from 'react';

describe('Header', () => {
  it('created header tag', () => {
    const header: JSX.Element = Header();

    expect(header.type).toBe('header');
  });
});
