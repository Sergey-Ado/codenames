import { useTranslation } from 'react-i18next';

const onLeaveRoom = () => console.log('leaveRoom');

export function RoomPage() {
  const { t } = useTranslation();

  const exitButton = t('room.exit-button');

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
