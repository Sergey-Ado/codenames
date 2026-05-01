import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import process from 'node:process';

const listenMock = vi.fn((port, callback: () => void) => {
  if (callback) callback();
});

vi.mock('../app.ts', () => ({
  __esModule: true,
  default: { listen: listenMock },
}));

const logMock = vi.fn();
globalThis.console.log = logMock;

vi.mock('../types/envConstants.ts', () => ({
  envConstants: {
    PORT: '7788',
  },
}));

const OLD_ENV = { ...process.env };

describe('startServer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    vi.clearAllMocks();
    process.env = { ...OLD_ENV };
  });

  it('calls server.listen with PORT and logging when SHOW_LOG=true', async () => {
    process.env.SHOW_LOG = 'yes';
    process.env.PORT = '1234';
    process.env.NODE_ENV = 'test';

    const srvModule = await import('../index.ts');

    srvModule.startServer();
    expect(listenMock).toHaveBeenCalledWith('1234', expect.any(Function));
    expect(logMock).toHaveBeenCalledWith(
      expect.stringContaining('Server running on port 1234')
    );
  });

  it('calls server.listen without callback when SHOW_LOG=false', async () => {
    process.env.SHOW_LOG = '';
    process.env.PORT = '9999';
    process.env.NODE_ENV = 'test';

    const srvModule = await import('../index.ts');

    srvModule.startServer();
    expect(listenMock).toHaveBeenCalledWith('9999');
    expect(logMock).not.toHaveBeenCalled();
  });

  it('takes the port from envConstants by default if PORT is not specified', async () => {
    delete process.env.PORT;
    process.env.SHOW_LOG = 'yes';
    process.env.NODE_ENV = 'test';

    const srvModule = await import('../index.ts');

    srvModule.startServer();
    expect(listenMock).toHaveBeenCalledWith('7788', expect.any(Function));
  });
});
