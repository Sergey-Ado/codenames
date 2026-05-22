import { TypedSocket } from '@/types/general.types';
import { RoomState } from '@repo/shared/room';
import { useTranslation } from 'react-i18next';

interface props {
  socket: TypedSocket;
  roomState: RoomState;
}

export function RoomTitle({ socket, roomState }: props) {
  const { t } = useTranslation();

  const exitButton = t('room.exit-button');
  const roomTitle = t('room.title');

  const onLeaveRoom = () => {
    console.log('leaveRoom');
    socket.emit('lobby:leave-room');
  };

  return (
    <div className="visual-panel flex justify-center items-center p-2 gap-2">
      <h2 className="grow text-center sm:text-xl truncate">
        {`${roomTitle}${roomState.name}`}
      </h2>
      <button
        className="button normal-case px-2 py-2 sm:px-4  whitespace-nowrap"
        onClick={onLeaveRoom}>
        {exitButton}
      </button>
    </div>
  );
}
