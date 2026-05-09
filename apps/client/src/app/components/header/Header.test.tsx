import { render } from '@testing-library/react';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { describe, it, vi } from 'vitest';
import { Header } from './Header';

function renderWithRouter(ui: ReactNode) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

vi.mock('react-redux', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useSelector: (fn: any) =>
    fn({
      general: {
        userdata: { id: 'userId', username: 'username' },
      },
    }),
  useDispatch: () => vi.fn(),
}));

describe('Header', () => {
  it('rendered', () => {
    renderWithRouter(<Header />);
  });

  // it('calls console when click avatar', async () => {
  //   const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

  //   renderWithRouter(<Header />);

  //   const user = userEvent.setup();
  //   await user.click(screen.getByRole('avatar'));

  //   expect(spy).toHaveBeenCalledWith('click avatar');
  // });
});
