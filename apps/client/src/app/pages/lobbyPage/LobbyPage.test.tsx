import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LobbyPage } from './LobbyPage';

describe('LobbyPage', () => {
  it('render base', () => {
    render(<LobbyPage />);
    expect(screen.getByText(/Lobby/i)).toBeInTheDocument();
  });
});
