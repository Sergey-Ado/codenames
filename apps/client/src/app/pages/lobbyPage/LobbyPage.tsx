import { changeShowSpinner, changeUserdata } from '@/app/store/generalSlice';
import { Pages } from '@/types/general.types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RoomPreviewUI } from './roomPreview/RoomPreview';
import { RoomPreview } from '@repo/shared/room';
import { useLoaderData, useNavigate } from 'react-router';
import { socket } from '@/app/router/router';
import { Player } from '@repo/shared/user';
import { RootState } from '@/app/store/store';

interface IEnteredToRoom {
  player: Player;
}

export function LobbyPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, username } = useSelector(
    (state: RootState) => state.general.userdata
  );

  const { roomPreviews } = useLoaderData<{ roomPreviews: RoomPreview[] }>();

  useEffect(() => {
    if (id && username) {
      dispatch(changeUserdata({ id, username }));
    }

    dispatch(changeShowSpinner(false));

    const onEnteredToRoom = ({ player }: IEnteredToRoom) => {
      if (player.id === id) {
        navigate(`/${Pages.ROOM}`);
      }
    };

    socket.on('lobby:entered-to-room', onEnteredToRoom);

    return () => {
      socket.off('lobby:entered-to-room', onEnteredToRoom);
    };
  }, [dispatch, navigate, id, username]);

  const rooms = roomPreviews.map(roomPreview => {
    return <RoomPreviewUI roomPreview={roomPreview} key={roomPreview.id} />;
  });

  return (
    <main className="grow flex flex-col items-start w-full max-w-7xl p-2 pt-0 sm:px-5">
      <div className="visual-panel w-full flex grow justify-center items-start p-2">
        <div className="flex flex-wrap justify-center gap-2">{rooms}</div>
      </div>
    </main>
  );
}
