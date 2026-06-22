import { TypedSocket } from '@/types/general.types';
import { RoomState } from '@repo/shared/room';
import clsx from 'clsx';
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
    <div
      className={clsx(
        'visual-panel p-2',
        'flex flex-col justify-center items-start gap-2',
        'xs:flex-row xs:items-center'
      )}>
      <h2 className="grow text-center xs:text-xl truncate max-w-full">
        {`${roomTitle} ${roomState.name}`}
      </h2>
      <button
        className="button normal-case px-2 py-2 xs:px-4  whitespace-nowrap self-end"
        onClick={onLeaveRoom}>
        {exitButton}
      </button>
    </div>
  );
}
