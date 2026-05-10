import { changeUserdata } from '@/app/store/generalSlice';
import { StorageConstants } from '@/types/general.types';
import { useDispatch } from 'react-redux';

export function LobbyPage() {
  const dispatch = useDispatch();

  const id = sessionStorage.getItem(StorageConstants.USER_ID);
  const username = sessionStorage.getItem(StorageConstants.USERNAME);

  if (id && username) {
    dispatch(changeUserdata({ id, username }));
  }

  return (
    <main className="grow flex w-full max-w-7xl p-5 pt-0">
      <div className="visual-panel w-full flex justify-center items-center">
        Lobby page
      </div>
    </main>
  );
}
