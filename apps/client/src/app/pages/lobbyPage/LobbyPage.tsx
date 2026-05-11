import { changeUserdata } from '@/app/store/generalSlice';
import { StorageConstants } from '@/types/general.types';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export function LobbyPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    const id = sessionStorage.getItem(StorageConstants.USER_ID);
    const username = sessionStorage.getItem(StorageConstants.USERNAME);

    if (id && username) {
      dispatch(changeUserdata({ id, username }));
    }
  }, [dispatch]);

  return (
    <main className="grow flex w-full max-w-7xl p-5 pt-0">
      <div className="visual-panel w-full flex justify-center items-center">
        Lobby page
      </div>
    </main>
  );
}
