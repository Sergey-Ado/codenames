import { useTranslation } from 'react-i18next';

const onCreateNewRoom = () => console.log('create new room');

export function LobbyHeader() {
  const { t } = useTranslation();

  const createText = t('lobby.create');

  return (
    <div className="visual-panel w-full flex px-3 py-1.5">
      <button
        className="button px-2 py-1 normal-case"
        onClick={onCreateNewRoom}>
        {createText}
      </button>
    </div>
  );
}
