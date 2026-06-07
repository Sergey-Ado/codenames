import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LobbyHeader } from './LobbyHeader';
import userEvent from '@testing-library/user-event';

describe('LobbyHeader', () => {
  it('should be rendered', () => {
    render(<LobbyHeader />);

    expect(screen.queryByRole('button')).toBeInTheDocument();
  });

  it('should render room create form when click button', () => {
    render(<LobbyHeader />);

    fireEvent.click(screen.getByRole('button'));

    expect(screen.queryByRole('room-create-form')).toBeInTheDocument();
  });

  it('should close room create form when submit new room data', async () => {
    render(<LobbyHeader />);

    fireEvent.click(screen.getByRole('button'));

    expect(screen.queryByRole('room-create-form')).toBeInTheDocument();

    const user = userEvent.setup();

    const inputName = screen.getByRole('input-name');
    await user.type(inputName, 'new-room');

    const submit = screen.getByRole('submit');
    await user.click(submit);

    expect(screen.queryByRole('room-create-form')).not.toBeInTheDocument();
  });
});
