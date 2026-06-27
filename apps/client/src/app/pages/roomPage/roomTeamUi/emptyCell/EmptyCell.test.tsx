import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EmptyCell } from './EmptyCell';

describe('EmptyCell', () => {
  it('rendered', () => {
    render(<EmptyCell callback={vi.fn()} />);

    const emptyCell = screen.getByRole('empty-cell');

    expect(emptyCell).toBeInTheDocument();
  });
});
