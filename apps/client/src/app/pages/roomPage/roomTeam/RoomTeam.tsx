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

interface IAddedTeamAndRole {
  player: Player;
  teamType: TypedTeam;
  role: TypedRole;
}

export function RoomTeam({ teamType, team, maxCount, socket }: props) {
  const { id } = useSelector((state: RootState) => state.general.userdata);

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
    const onAddedTeamAndRole = ({
      player,
      teamType: newTeam,
    }: IAddedTeamAndRole) => {
      if (teamType === newTeam) {
        const newOperativeList = [...operativeList, player];
        setOperativeList(newOperativeList);
        setShowEmptyOperative(
          !newOperativeList.some(operative => operative.id === id)
        );
      }
    };

    socket.on('room:added-team-and-role', onAddedTeamAndRole);
  });

  const spymaster = team.spymaster ? (
    <div className="flex gap-2 items-center">
      <div className="border dark:text-white rounded-full">
        <Avatar seed={team.spymaster.id} size={42} />
      </div>
      <span>{team.spymaster.username}</span>
    </div>
  ) : (
    <EmptyCell callback={onClickSpymaster} />
  );

  const operatives = operativeList.map(operative => (
    <div className="flex gap-2 items-center" key={operative.id}>
      <div className="border dark:text-white rounded-full">
        <Avatar seed={operative.id} size={42} />
      </div>
      <span>{operative.username}</span>
    </div>
  ));

  return (
    <div className="visual-panel grow flex flex-col items-center p-2 gap-2">
      <h2
        className={clsx(
          'text-xl',
          teamType === 'red' ? 'text-red-500' : 'text-blue-500'
        )}>
        {title}
      </h2>
      <span className="underline">{spymasterTitle}</span>
      {spymaster}
      <span className="underline">{operativesTitle}</span>
      {operatives}
      {team.operatives.length < maxCount - 1 && showEmptyOperative && (
        <EmptyCell callback={onClickOperative} />
      )}
    </div>
  );
}
