import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LobbySearch } from './LobbySearch';
import { TypedSocket } from '@/types/general.types';

const mockEmit = vi.fn();

const socket: Partial<TypedSocket> = {
  emit: mockEmit,
};

describe('LobbySearch', () => {
  it('should rendered', () => {
    render(<LobbySearch socket={socket as TypedSocket} />);
  });

  it('should call socket.emit if click cross button', () => {
    render(<LobbySearch socket={socket as TypedSocket} />);

    const searchCross = screen.getByRole('search-cross');

    fireEvent.click(searchCross);

    expect(mockEmit).toHaveBeenCalledWith('lobby:search-rooms', { key: '' });
  });

  it('should call socket.emit if click search button', () => {
    render(<LobbySearch socket={socket as TypedSocket} />);

    const searchInput = screen.getByRole('search-input');
    const searchButton = screen.getByRole('search-button');

    fireEvent.change(searchInput, { target: { value: 'key' } });
    fireEvent.click(searchButton);

    expect(mockEmit).toHaveBeenCalledWith('lobby:search-rooms', { key: 'key' });
  });

  it('should not call socket.emit if input consist of only spaces', () => {
    const emptyInput = '   ';

    render(<LobbySearch socket={socket as TypedSocket} />);

    const searchInput = screen.getByRole('search-input');
    const searchButton = screen.getByRole('search-button');

    fireEvent.change(searchInput, { target: { value: emptyInput } });
    fireEvent.click(searchButton);

    expect(mockEmit).not.toHaveBeenCalledWith('lobby:search-rooms', {
      key: emptyInput,
    });
  });
});
