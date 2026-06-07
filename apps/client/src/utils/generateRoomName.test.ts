import { describe, expect, it, vi } from 'vitest';
import { generateRoomName } from './generateRoomName';

describe('generateRoomName', () => {
  it('should return room name', () => {
    const spy = vi.spyOn(Math, 'random').mockImplementation(() => 0);

    const roomName = generateRoomName();

    expect(spy).toHaveBeenCalledTimes(3);
    expect(roomName).toEqual('js-masters-00');

    spy.mockRestore();
  });
});
