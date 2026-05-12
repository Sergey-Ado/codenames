import { TypedServerIo, TypedSocket } from '../../types/types.ts';
import { sendStatus } from './sessionHandlers.ts';

export const initialConnected = (io: TypedServerIo) => {
  console.log('call initialConnected');
  return (socket: TypedSocket): void => {
    socket.on('session:ask-status', sendStatus(io, socket));
  };
};
