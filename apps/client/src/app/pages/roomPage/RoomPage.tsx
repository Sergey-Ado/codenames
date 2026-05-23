import store from '@/app/store/store';
import { Pages, TypedSocket } from '@/types/general.types';
import { RoomState } from '@repo/shared/room';
import { useEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router';
import { RoomTitle } from './roomTitle/RoomTitle';
import { UnknownTeam } from './unknownTeam/UnknownTeam';

interface ILeftToRoom {
  userId: string;
}

export function RoomPage() {
  const navigate = useNavigate();

  const { roomState, socket } = useLoaderData<{
    roomState: RoomState;
    socket: TypedSocket;
  }>();

  useEffect(() => {
    const onLeftRoom = ({ userId }: ILeftToRoom) => {
      const id = store.getState().general.userdata.id;
      if (userId === id) {
        navigate(`/${Pages.LOBBY}`);
      }
    };

    socket.on('lobby:left-room', onLeftRoom);

    return () => {
      socket.off('lobby:left-room', onLeftRoom);
    };
  });

  return (
    <main className="w-full grow flex max-w-7xl flex-col px-3 sm:px-5 gap-2">
      <RoomTitle socket={socket} roomState={roomState} />
      <UnknownTeam roomState={roomState} />
    </main>
  );
}
