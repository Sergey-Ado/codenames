import Avatar from '@/app/components/avatar/Avatar';
import { socket } from '@/app/router/router';
import { RoomPreview } from '@repo/shared/room';
import { useTranslation } from 'react-i18next';

interface props {
  roomPreview: RoomPreview;
}

export function RoomPreviewUI({ roomPreview }: props) {
  const { id } = roomPreview;

  const onClick = () => {
    socket.emit('lobby:enter-to-room', { roomId: id });
  };

  const { t } = useTranslation();

  let status = '';
  switch (roomPreview.status) {
    case 'fulled': {
      status = t('lobby.status.fulled');
      break;
    }
    default: {
      status = t('lobby.status.waiting');
    }
  }

  const buttonCaption = t('lobby.enter');

  const avatars = roomPreview.players.map((player, index) => (
    <div
      key={player.id}
      className={`${index < roomPreview.players.length - 1 ? '-mr-3 hover:mr-0.5' : ''} duration-200 border rounded-full`}>
      <Avatar seed={player.id} title={player.username} size={36} />
    </div>
  ));

  return (
    <div className="bg-white dark:bg-secondary-dark rounded-lg border px-2 py-2 w-3xs max-w-3xs">
      <span className="text-xl">{roomPreview.name}</span>
      <div className="flex my-1.5">{avatars}</div>
      <div className="flex justify-between items-center w-full">
        <span>{`${roomPreview.currentCount} / ${roomPreview.maxCount}`}</span>
        <span className="capitalize">{status}</span>
        <button
          type="button"
          className="button px-2 py-1"
          disabled={roomPreview.status !== 'waiting'}
          onClick={onClick}>
          {buttonCaption}
        </button>
      </div>
    </div>
  );
}
