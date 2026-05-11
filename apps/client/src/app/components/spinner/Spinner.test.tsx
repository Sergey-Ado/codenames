import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('rendered', () => {
    render(<Spinner />);

    const status = screen.getByRole('status');

    expect(status).toBeInTheDocument();
  });
});
