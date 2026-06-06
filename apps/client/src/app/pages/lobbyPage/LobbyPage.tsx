import { changeShowSpinner, changeUserdata } from '@/app/store/generalSlice';
import { Pages, TypedSocket } from '@/types/general.types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RoomPreviewUI } from './roomPreviewUi/RoomPreviewUi';
import { RoomPreview } from '@repo/shared/room';
import { useLoaderData, useNavigate } from 'react-router';
import { RootState } from '@/app/store/store';
import { LobbyHeader } from './lobbyHeader/LobbyHeader';

interface IEnteredToRoom {
  userId: string;
}

export function LobbyPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, username } = useSelector(
    (state: RootState) => state.general.userdata
  );

  const { roomPreviews, socket } = useLoaderData<{
    roomPreviews: RoomPreview[];
    socket: TypedSocket;
  }>();

  useEffect(() => {
    if (id && username) {
      dispatch(changeUserdata({ id, username }));
    }

    dispatch(changeShowSpinner(false));

    const onEnteredToRoom = ({ userId }: IEnteredToRoom) => {
      if (userId === id) {
        navigate(`/${Pages.ROOM}`);
      }
    };

    socket.on('lobby:entered-to-room', onEnteredToRoom);

    return () => {
      socket.off('lobby:entered-to-room', onEnteredToRoom);
    };
  }, [dispatch, navigate, id, username, socket]);

  const rooms = roomPreviews.map(roomPreview => {
    return (
      <RoomPreviewUI
        roomPreview={roomPreview}
        socket={socket}
        key={roomPreview.id}
      />
    );
  });

  return (
    <main className="grow flex flex-col items-start w-full max-w-7xl p-2 pt-0 sm:px-5 gap-2">
      <LobbyHeader />
      <div className="visual-panel w-full flex grow justify-center items-start p-2">
        <div className="flex flex-wrap justify-center gap-2">{rooms}</div>
      </div>
    </main>
  );
}
