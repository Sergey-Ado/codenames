import store from '@/app/store/store';
import { Pages, TypedSocket } from '@/types/general.types';
import { RoomState } from '@repo/shared/room';
import { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router';
import { RoomTitle } from './roomTitle/RoomTitle';
import { RoomTeam } from './roomTeam/RoomTeam';
import { UnknownTeam } from './unknownTeam/UnknownTeam';
import { ModalWrapper } from '@/app/components/modalWrapper/ModalWrapper';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

interface ILeftToRoom {
  userId: string;
}

const onGameStarted = () => console.log('game started');

export function RoomPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

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

    const onStartedGameStartTimer = () => setShowModal(true);

    socket.on('lobby:left-room', onLeftRoom);
    socket.on('room:started-game-start-timer', onStartedGameStartTimer);
    socket.on('room:started-game', onGameStarted);

    return () => {
      socket.off('lobby:left-room', onLeftRoom);
      socket.off('room:started-game-start-timer', onStartedGameStartTimer);
      socket.off('room:started-game', onGameStarted);
    };
  });

  const { t } = useTranslation();

  const gameStartModal = (
    <ModalWrapper>
      <div
        className={clsx(
          'flex flex-col items-center gap-3',
          'bg-primary-light dark:bg-primary-dark',
          'p-4 rounded-md border'
        )}>
        <h2 className="font-bold text-xl">
          {t('room.game-start-modal.title')}
        </h2>
        <p>{t('room.game-start-modal.text')}</p>
      </div>
    </ModalWrapper>
  );

  return (
    <main className="w-full grow flex max-w-7xl flex-col px-3 sm:px-5 gap-2">
      <RoomTitle socket={socket} roomState={roomState} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
      {showModal && gameStartModal}
    </main>
  );
}
