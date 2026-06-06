import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LobbyHeader } from './LobbyHeader';

describe('LobbyHeader', () => {
  it('should render', () => {
    render(<LobbyHeader />);

    expect(screen.queryByRole('button')).toBeInTheDocument();
  });

  it('should call console.log when click button', () => {
    render(<LobbyHeader />);

    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    fireEvent.click(screen.getByRole('button'));

    expect(spy).toHaveBeenCalledWith('create new room');

    spy.mockRestore();
  });
});
