import { socket } from '@/app/router/router';
import store from '@/app/store/store';
import { Pages, TypedSocket } from '@/types/general.types';
import { RoomPreview } from '@repo/shared/room';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData, useNavigate } from 'react-router';

interface ILeftToRoom {
  userId: string;
}

const onLeaveRoom = () => {
  console.log('leaveRoom');
  socket.emit('lobby:leave-room');
};

export function RoomPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const exitButton = t('room.exit-button');

  const { roomPreview, socket } = useLoaderData<{
    roomPreview: RoomPreview;
    socket: TypedSocket;
  }>();

  console.log(roomPreview);

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
    <main className="grow flex justify-center items-center">
      <div className="visual-panel">
        <button className="button normal-case px-4 py-2" onClick={onLeaveRoom}>
          {exitButton}
        </button>
      </div>
    </main>
  );
}
