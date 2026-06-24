import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Timer } from './Timer';

describe('Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should rendered with specific duration', () => {
    render(<Timer duration={15} />);

    const timerValue = screen.getByRole('timer-value');

    expect(timerValue).toHaveTextContent('15');
  });

  it('should change value', async () => {
    render(<Timer duration={15} />);

    const timerValue = screen.getByRole('timer-value');
    expect(timerValue).toHaveTextContent('15');

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(timerValue).toHaveTextContent('14');
  });
});
