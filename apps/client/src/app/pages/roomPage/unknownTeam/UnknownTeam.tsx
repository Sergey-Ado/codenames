import Avatar from '@/app/components/avatar/Avatar';
import { RoomState } from '@repo/shared/room';

interface props {
  roomState: RoomState;
}

export function UnknownTeam({ roomState }: props) {
  const avatars = roomState.teams.unknown.map(player => (
    <Avatar seed={player.id} key={player.id} title={player.username} />
  ));

  return (
    <div
      className="visual-panel p-2 flex justify-center items-center gap-1 flex-wrap"
      role="unknown-team">
      {avatars}
    </div>
  );
}
