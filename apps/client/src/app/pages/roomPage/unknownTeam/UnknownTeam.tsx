import Avatar from '@/app/components/avatar/Avatar';
import { RootState } from '@/app/store/store';
import { TypedSocket } from '@/types/general.types';
import { RoomState, RoomRoleType, RoomTeamType } from '@repo/shared/room';
import { Player } from '@repo/shared/user';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { EmptyCell } from '../roomTeamUi/emptyCell/EmptyCell';

interface props {
  roomState: RoomState;
  socket: TypedSocket;
}

interface IRemovedTeamAndRole {
  userId: string;
  teamType: RoomTeamType;
  role: RoomRoleType;
}

interface IAddedTeamAndRole {
  player: Player;
  teamType: RoomTeamType;
  role: RoomRoleType;
}

export function UnknownTeam({ roomState, socket }: props) {
  const { id } = useSelector((state: RootState) => state.general.userdata);

  const [players, setPlayers] = useState<Player[]>(roomState.teams.unknown);
  const [showEmpty, setShowEmpty] = useState(
    !roomState.teams.unknown.some(player => player.id === id)
  );

  const onClickUnknown = () => {
    socket.emit('room:add-team-and-role', {
      teamType: 'unknown',
      role: 'unknown',
    });
  };

  useEffect(() => {
    const onRemovedTeamAndRole = ({
      userId,
      teamType,
    }: IRemovedTeamAndRole) => {
      if (teamType === 'unknown') {
        const newPlayers = players.filter(player => player.id !== userId);
        setPlayers(newPlayers);

        setShowEmpty(!newPlayers.some(player => player.id === id));
      }
    };

    const onAddedTeamAndRole = ({ player, teamType }: IAddedTeamAndRole) => {
      if (teamType === 'unknown') {
        const newPlayers = [...players, player];
        setPlayers(newPlayers);
        setShowEmpty(!newPlayers.some(player => player.id === id));
      }
    };

    socket.on('room:removed-team-and-role', onRemovedTeamAndRole);
    socket.on('room:added-team-and-role', onAddedTeamAndRole);

    return () => {
      socket.off('room:removed-team-and-role', onRemovedTeamAndRole);
      socket.off('room:added-team-and-role', onAddedTeamAndRole);
    };
  }, [players, socket, id]);

  const avatars = players.map(player => (
    <div className="border dark:text-white rounded-full" key={player.id}>
      <Avatar seed={player.id} title={player.username} />
    </div>
  ));

  return (
    <div
      className="visual-panel p-2 flex justify-center items-center gap-1 flex-wrap"
      role="unknown-team">
      {avatars}
      {showEmpty && <EmptyCell callback={onClickUnknown} small={true} />}
    </div>
  );
}
