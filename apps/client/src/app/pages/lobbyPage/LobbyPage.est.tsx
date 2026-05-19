import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, it, vi } from 'vitest';
import { LobbyPage } from './LobbyPage';

vi.mock('react-redux', () => ({
  useDispatch: () => vi.fn(),
  useSelector: () => vi.fn(),
}));

vi.mock('react-router', () => ({
  useLoaderData: () => ({ roomPreviews: [] }),
  useNavigate: () => vi.fn(),
  createBrowserRouter: () => vi.fn(),
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
  });
});
