import { changeShowSpinner, changeUserdata } from '@/app/store/generalSlice';
import { StorageConstants } from '@/types/general.types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { RoomPreviewUI } from './roomPreview/RoomPreview';
import { RoomPreview } from '@repo/shared/room';

export function LobbyPage() {
  const [roomPreviews, setRoomPreviews] = useState<RoomPreview[]>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const id = sessionStorage.getItem(StorageConstants.USER_ID);
    const username = sessionStorage.getItem(StorageConstants.USERNAME);

    if (id && username) {
      dispatch(changeUserdata({ id, username }));
    }

    dispatch(changeShowSpinner(false));

    import('./roomPreviews.json').then(result =>
      setRoomPreviews(result.roomPreviews)
    );
  }, [dispatch]);

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
