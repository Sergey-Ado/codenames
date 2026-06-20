import { changeShowSpinner, changeUserdata } from '@/app/store/generalSlice';
import { Pages, TypedSocket } from '@/types/general.types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RoomPreviewUI } from './roomPreviewUi/RoomPreviewUi';
import { RoomPreview } from '@repo/shared/room';
import { useLoaderData, useNavigate } from 'react-router';
import { RootState } from '@/app/store/store';
import { LobbyHeader } from './lobbyHeader/LobbyHeader';

interface IEnteredToRoom {
  userId: string;
}

interface ICreatedRoom {
  roomPreview: RoomPreview;
}

interface IRemovedRoom {
  roomId: string;
}

interface ISendState {
  roomPreviews: RoomPreview[];
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

  const [previewList, setPreviewList] = useState(roomPreviews);

  useEffect(() => {
    if (id && username) {
      dispatch(changeUserdata({ id, username }));
    }

    const onEnteredToRoom = ({ userId }: IEnteredToRoom) => {
      if (userId === id) {
        navigate(`/${Pages.ROOM}`);
      }
    };

    const onCreatedRoom = ({ roomPreview }: ICreatedRoom) => {
      setPreviewList([...previewList, roomPreview]);
    };

    const onRemovedRoom = ({ roomId }: IRemovedRoom) => {
      setPreviewList(previewList.filter(preview => preview.id !== roomId));
    };

    const onSendState = ({ roomPreviews }: ISendState) => {
      setPreviewList(roomPreviews);
    };

    dispatch(changeShowSpinner(false));

    socket.on('lobby:entered-to-room', onEnteredToRoom);
    socket.on('lobby:created-room', onCreatedRoom);
    socket.on('lobby:removed-room', onRemovedRoom);
    socket.on('lobby:send-state', onSendState);

    return () => {
      socket.off('lobby:entered-to-room', onEnteredToRoom);
      socket.off('lobby:created-room', onCreatedRoom);
      socket.off('lobby:removed-room', onRemovedRoom);
      socket.off('lobby:send-state', onSendState);
    };
  }, [dispatch, navigate, id, username, socket, setPreviewList, previewList]);

  const rooms = previewList.map(roomPreview => {
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
      <LobbyHeader socket={socket} />
      <div className="visual-panel w-full flex grow justify-center items-start p-2">
        <div className="flex flex-wrap justify-center gap-2">{rooms}</div>
      </div>
    </main>
  );
}
