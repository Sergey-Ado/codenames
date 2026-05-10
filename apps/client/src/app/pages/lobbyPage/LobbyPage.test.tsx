import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LobbyPage } from './LobbyPage';

vi.mock('react-redux', () => ({
  useDispatch: () => vi.fn(),
}));

beforeEach(() => {
  vi.resetAllMocks();
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('LobbyPage', () => {
  it('render base', () => {
    render(<LobbyPage />);
    expect(screen.getByText(/Lobby/i)).toBeInTheDocument();
  });
});
