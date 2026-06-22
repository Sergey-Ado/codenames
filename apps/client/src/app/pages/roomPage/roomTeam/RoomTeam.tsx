import Avatar from '@/app/components/avatar/Avatar';
import { ITeam, TypedRole, TypedTeam } from '@repo/shared/room';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { EmptyCell } from './emptyCell/EmptyCell';
import { TypedSocket } from '@/types/general.types';
import { useEffect, useState } from 'react';
import { Player } from '@repo/shared/user';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';

interface props {
  teamType: 'red' | 'blue';
  team: ITeam;
  maxCount: number;
  socket: TypedSocket;
}

interface IRemovedTeamAndRole {
  userId: string;
  teamType: TypedTeam;
  role: TypedRole;
}

interface IAddedTeamAndRole {
  player: Player;
  teamType: TypedTeam;
  role: TypedRole;
}

const onStartedGameStartTimer = () => console.log('started game start times');
const onGameStarted = () => console.log('game started');

export function RoomTeam({ teamType, team, maxCount, socket }: props) {
  const { id } = useSelector((state: RootState) => state.general.userdata);

  const [spymaster, setSpymaster] = useState(team.spymaster);
  const [operativeList, setOperativeList] = useState(team.operatives);
  const [showEmptyOperative, setShowEmptyOperative] = useState(
    !team.operatives.some(operative => operative.id === id)
  );

  const { t } = useTranslation();

  const title = t(teamType === 'red' ? 'room.red-title' : 'room.blue-title');
  const spymasterTitle = t('room.spymaster');
  const operativesTitle = t('room.operatives');

  const onClickSpymaster = () => {
    socket.emit('room:add-team-and-role', { teamType, role: 'spymaster' });
  };
  const onClickOperative = () => {
    socket.emit('room:add-team-and-role', { teamType, role: 'operative' });
  };

  useEffect(() => {
    const onRemovedTeamAndRole = ({
      userId,
      teamType: newTeam,
      role,
    }: IRemovedTeamAndRole) => {
      if (teamType === newTeam) {
        if (role === 'spymaster') {
          setSpymaster(null);
        }
        if (role === 'operative') {
          const newOperativeList = operativeList.filter(
            operative => operative.id !== userId
          );
          setOperativeList(newOperativeList);
          setShowEmptyOperative(
            !newOperativeList.some(operative => operative.id === id)
          );
        }
      }
    };

    const onAddedTeamAndRole = ({
      player,
      teamType: newTeam,
      role,
    }: IAddedTeamAndRole) => {
      if (teamType === newTeam) {
        if (role === 'spymaster') {
          setSpymaster(player);
        }
        if (role === 'operative') {
          const newOperativeList = [...operativeList, player];
          setOperativeList(newOperativeList);
          setShowEmptyOperative(
            !newOperativeList.some(operative => operative.id === id)
          );
        }
      }
    };

    socket.on('room:added-team-and-role', onAddedTeamAndRole);
    socket.on('room:removed-team-and-role', onRemovedTeamAndRole);
    socket.on('room:started-game-start-timer', onStartedGameStartTimer);
    socket.on('room:started-game', onGameStarted);

    return () => {
      socket.off('room:added-team-and-role', onAddedTeamAndRole);
      socket.off('room:removed-team-and-role', onRemovedTeamAndRole);
      socket.off('room:started-game-start-timer', onStartedGameStartTimer);
      socket.off('room:started-game', onGameStarted);
    };
  });

  const spymasterCell = spymaster ? (
    <div className="flex gap-2 items-center w-full justify-center">
      <div className="border dark:text-white rounded-full">
        <Avatar seed={spymaster.id} size={42} />
      </div>
      <span className="truncate">{spymaster.username}</span>
    </div>
  ) : (
    <EmptyCell callback={onClickSpymaster} />
  );

  const operatives = operativeList.map(operative => (
    <div
      className="flex gap-2 items-center w-full justify-center"
      key={operative.id}>
      <div className="border dark:text-white rounded-full">
        <Avatar seed={operative.id} size={42} />
      </div>
      <span className="truncate">{operative.username}</span>
    </div>
  ));

  return (
    <div className="visual-panel grow flex flex-col items-center p-2 gap-2 order-1">
      <h2
        className={clsx(
          'text-xl',
          teamType === 'red' ? 'text-red-500' : 'text-blue-500'
        )}>
        {title}
      </h2>
      <span className="underline">{spymasterTitle}</span>
      {spymasterCell}
      <span className="underline">{operativesTitle}</span>
      {operatives}
      {operatives.length < maxCount - 1 && showEmptyOperative && (
        <EmptyCell callback={onClickOperative} />
      )}
    </div>
  );
}
