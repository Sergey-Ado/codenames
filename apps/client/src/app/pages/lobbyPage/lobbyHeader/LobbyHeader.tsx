import { useTranslation } from 'react-i18next';
import { RoomCreateForm } from './roomCreateForm/RoomCreateForm';
import { useState } from 'react';
import { TypedSocket } from '@/types/general.types';

interface props {
  socket: TypedSocket;
}

export function LobbyHeader({ socket }: props) {
  const [showForm, setShowForm] = useState(false);

  const { t } = useTranslation();

  const createText = t('lobby.create');

  const onCreateNewRoom = () => setShowForm(true);

  const onCallback = () => setShowForm(false);

  return (
    <div className="visual-panel w-full flex px-3 py-1.5">
      <button
        className="button px-2 py-1 normal-case"
        onClick={onCreateNewRoom}>
        {createText}
      </button>
      {showForm && <RoomCreateForm socket={socket} callback={onCallback} />}
    </div>
  );
}
