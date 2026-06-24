import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Timer } from '../../utils/timer.ts';

describe('Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('start method should create instance of setInterval', () => {
    const timer = new Timer(1);

    expect(timer['interval']).toBeUndefined();

    timer.start(vi.fn());

    expect(timer['interval']).toBeDefined();
  });

  it('setInterval should call callback when the time has elapsed', () => {
    const timer = new Timer(5);

    const callback = vi.fn();

    timer.start(callback);

    vi.advanceTimersByTime(5000);

    expect(callback).toHaveBeenCalled();
  });
});
