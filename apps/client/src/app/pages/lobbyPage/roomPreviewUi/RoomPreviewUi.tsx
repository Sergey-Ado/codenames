import Avatar from '@/app/components/avatar/Avatar';
import { TypedSocket } from '@/types/general.types';
import { RoomPreview } from '@repo/shared/room';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface props {
  roomPreview: RoomPreview;
  socket: TypedSocket;
}

interface IUpdatePreview {
  roomPreview: RoomPreview;
}

export function RoomPreviewUI({ roomPreview, socket }: props) {
  const [preview, setPreview] = useState(roomPreview);

  useEffect(() => {
    const onUpdatePreview = ({ roomPreview }: IUpdatePreview) => {
      if (roomPreview.id === preview.id) {
        setPreview(roomPreview);
      }
    };

    socket.on('lobby:update-preview', onUpdatePreview);

    return () => {
      socket.off('lobby:update-preview', onUpdatePreview);
    };
  });

  const onClick = () => {
    socket.emit('lobby:enter-to-room', { roomId: preview.id });
  };

  const { t } = useTranslation();

  let status = '';
  switch (preview.status) {
    case 'fulled': {
      status = t('lobby.status.fulled');
      break;
    }
    default: {
      status = t('lobby.status.waiting');
    }
  }

  const buttonCaption = t('lobby.enter');

  const avatars = preview.players.map((player, index) => (
    <div
      key={player.id}
      className={`${index < preview.players.length - 1 ? '-mr-3 hover:mr-0.5' : ''} duration-200 border rounded-full preview-avatar`}>
      <Avatar seed={player.id} title={player.username} size={36} />
    </div>
  ));

  return (
    <div className="bg-white dark:bg-secondary-dark rounded-lg border px-2 py-2 w-3xs max-w-3xs">
      <div className="text-xl truncate max-w-full">{preview.name}</div>
      <div className="flex my-1.5">{avatars}</div>
      <div className="flex justify-between items-center w-full">
        <span>{`${preview.currentCount} / ${preview.maxCount}`}</span>
        <span className="capitalize" role="show-status">
          {status}
        </span>
        <button
          type="button"
          className="button px-2 py-1"
          disabled={preview.status !== 'waiting'}
          onClick={onClick}>
          {buttonCaption}
        </button>
      </div>
    </div>
  );
}
