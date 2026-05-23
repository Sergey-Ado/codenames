import Avatar from '@/app/components/avatar/Avatar';
import { ITeam } from '@repo/shared/room';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { EmptyCell } from './emptyCell/EmptyCell';

interface props {
  type: 'red' | 'blue';
  team: ITeam;
  maxCount: number;
}

export function RoomTeam({ type, team, maxCount }: props) {
  console.log(team);

  const { t } = useTranslation();

  const onClickSpymaster = () => {
    console.log('add spymaster');
  };
  const onClickOperative = () => {
    console.log('add operatives');
  };

  const title = t(type === 'red' ? 'room.red-title' : 'room.blue-title');
  const spymasterTitle = t('room.spymaster');
  const operativesTitle = t('room.operatives');

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

  const operatives = team.operatives.map(operative => (
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
          type === 'red' ? 'text-red-500' : 'text-blue-500'
        )}>
        {title}
      </h2>
      <span className="underline">{spymasterTitle}</span>
      {spymaster}
      <span className="underline">{operativesTitle}</span>
      {operatives}
      {team.operatives.length < maxCount - 1 && (
        <EmptyCell callback={onClickOperative} />
      )}
    </div>
  );
}
