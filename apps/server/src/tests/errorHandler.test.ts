/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { errorHandler } from '../api/errorHandler.ts';
import { HttpStatus } from '@repo/shared/api';

describe('errorHandler', () => {
  let res: any;

  beforeEach(() => {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('sends status and message if specified', () => {
    const error = { name: 'error', message: 'fail', status: 401 };
    errorHandler(error, {} as any, res);
    expect(console.error).toHaveBeenCalledWith(error);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'fail' });
  });

  it('sends 500 and message if no status is set', () => {
    const error = { name: 'error', message: 'err' };
    errorHandler(error, {} as any, res);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'err' });
  });

  it('sends a 500 and a default message if nothing is specified', () => {
    const error = {};
    errorHandler(error as any, {} as any, res);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});
