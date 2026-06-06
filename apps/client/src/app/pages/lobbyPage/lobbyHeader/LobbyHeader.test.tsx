import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LobbyHeader } from './LobbyHeader';

describe('LobbyHeader', () => {
  it('should render', () => {
    render(<LobbyHeader />);

    expect(screen.queryByRole('button')).toBeInTheDocument();
  });

  it('should call console.log when click button', () => {
    render(<LobbyHeader />);

    fireEvent.click(screen.getByRole('button'));

    expect(screen.queryByRole('room-create-form')).toBeInTheDocument();
  });
});
