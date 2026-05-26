import Avatar from '@/app/components/avatar/Avatar';
import { RootState } from '@/app/store/store';
import { TypedSocket } from '@/types/general.types';
import { RoomState, TypedRole, TypedTeam } from '@repo/shared/room';
import { Player } from '@repo/shared/user';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { EmptyCell } from '../roomTeam/emptyCell/EmptyCell';

interface props {
  roomState: RoomState;
  socket: TypedSocket;
}

interface IRemovedTeamAndRole {
  userId: string;
  team: TypedTeam;
  role: TypedRole;
}

const onClickUnknown = () => {
  console.log('add unknown');
};

export function UnknownTeam({ roomState, socket }: props) {
  const [players, setPlayers] = useState<Player[]>(roomState.teams.unknown);
  const [showEmpty, setShowEmpty] = useState(false);

  const { id } = useSelector((state: RootState) => state.general.userdata);

  useEffect(() => {
    const onRemovedTeamAndRole = ({ userId, team }: IRemovedTeamAndRole) => {
      if (team === 'unknown') {
        const newPlayers = players.filter(player => player.id !== userId);
        setPlayers(newPlayers);

        if (id === userId) setShowEmpty(true);
      }
    };

    socket.on('room:removed-team-and-role', onRemovedTeamAndRole);

    return () => {
      socket.off('room:removed-team-and-role', onRemovedTeamAndRole);
    };
  }, [players, socket, id]);

  const avatars = players.map(player => (
    <Avatar seed={player.id} key={player.id} title={player.username} />
  ));

  return (
    <div
      className="visual-panel p-2 flex justify-center items-center gap-1 flex-wrap"
      role="unknown-team">
      {avatars}
      {showEmpty && <EmptyCell callback={onClickUnknown} size={42} />}
    </div>
  );
}
