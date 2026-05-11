import { Socket } from 'socket.io';

export const initialConnected = () => {
  console.log('call initialConnected');
  return (socket: Socket): void => {
    console.log(socket.data.username);
    console.log(socket.data.userId);
  };
};
