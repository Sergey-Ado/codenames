import store from '@/app/store/store';
import { Pages, TypedSocket } from '@/types/general.types';
import { RoomState } from '@repo/shared/room';
import { useEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router';
import { RoomTitle } from './roomTitle/RoomTitle';
import { RoomTeam } from './roomTeam/RoomTeam';
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
      <div className="flex gap-2">
        <RoomTeam
          teamType="red"
          team={roomState.teams.red}
          maxCount={roomState.maxCount / 2}
          socket={socket}
        />
        <RoomTeam
          teamType="blue"
          team={roomState.teams.blue}
          maxCount={roomState.maxCount / 2}
          socket={socket}
        />
      </div>
      <UnknownTeam roomState={roomState} socket={socket} />
    </main>
  );
}
