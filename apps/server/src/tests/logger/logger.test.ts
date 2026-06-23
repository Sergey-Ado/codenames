import { describe, expect, it, vi } from 'vitest';
// import { getLogger } from '../socket/logger/logger.ts';
import process from 'node:process';
import { afterEach, beforeEach } from 'node:test';
import colors from 'colors';

const OLD_ENV = { ...process.env };

beforeEach(() => {
  vi.resetAllMocks();
  process.env = { ...OLD_ENV };
});

afterEach(() => {
  vi.resetAllMocks();
  process.env = { ...OLD_ENV };
});

describe('Logger', () => {
  it('emit should call console.log if SHOW_LOG!=yes', async () => {
    vi.resetModules();
    process.env.SHOW_LOG = 'no';

    const { getLogger } = await import('../../socket/logger/logger.ts');

    const logger = getLogger();

    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    logger.emit(['userId'], 'lobby:left-room', { userId: 'userId' });

    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });

  it('emit should call console.log if SHOW_LOG=yes', async () => {
    vi.resetModules();
    process.env.SHOW_LOG = 'yes';

    const { getLogger } = await import('../../socket/logger/logger.ts');

    const logger = getLogger();

    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    logger.emit(['userId'], 'lobby:left-room', { userId: 'userId' });

    expect(spy).toHaveBeenCalledWith(
      colors.yellow('lobby:left-room'),
      colors.green('TO'),
      ['userId']
    );

    spy.mockRestore();
  });

  it('on should call console.log if SHOW_LOG!=yes', async () => {
    vi.resetModules();
    process.env.SHOW_LOG = 'no';

    const { getLogger } = await import('../../socket/logger/logger.ts');

    const logger = getLogger();

    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    logger.on('userId', 'lobby:ask-state');

    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });

  it('emit should call console.log once if SHOW_LOG=yes and no payload is specified', async () => {
    vi.resetModules();
    process.env.SHOW_LOG = 'yes';

    const { getLogger } = await import('../../socket/logger/logger.ts');

    const logger = getLogger();

    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    logger.on('userId', 'lobby:ask-state');

    expect(spy).toHaveBeenCalledWith(
      colors.magenta('lobby:ask-state'),
      colors.green('FROM'),
      'userId'
    );

    spy.mockRestore();
  });

  it('emit should call console.log twice if SHOW_LOG=yes and payload is specified', async () => {
    vi.resetModules();
    process.env.SHOW_LOG = 'yes';

    const { getLogger } = await import('../../socket/logger/logger.ts');

    const logger = getLogger();

    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    logger.on('userId', 'lobby:enter-to-room', { roomId: 'roomId' });

    expect(spy).toHaveBeenCalledWith(
      colors.magenta('lobby:enter-to-room'),
      colors.green('FROM'),
      'userId'
    );
    expect(spy).toHaveBeenCalledWith('payload:', { roomId: 'roomId' });

    spy.mockRestore();
  });

  it('info should call console.log if SHOW_LOG=yes', async () => {
    vi.resetModules();
    process.env.SHOW_LOG = 'yes';

    const { getLogger } = await import('../../socket/logger/logger.ts');

    const logger = getLogger();

    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    logger.info('info');

    expect(spy).toHaveBeenCalledWith(colors.blue('info'));

    spy.mockRestore();
  });

  it('info should call console.log if SHOW_LOG!=yes', async () => {
    vi.resetModules();
    process.env.SHOW_LOG = 'no';

    const { getLogger } = await import('../../socket/logger/logger.ts');

    const logger = getLogger();

    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    logger.info('info');

    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });
});
