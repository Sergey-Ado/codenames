import { useDispatch, useSelector } from 'react-redux';
import Avatar from '../avatar/Avatar';
import { Logo } from './logo/Logo';
import { RootState } from '@/app/store/store';
import { AvatarMenu } from './avatarMenu/AvatarMenu';
import { changeOpenAvatarMenu } from '@/app/store/generalSlice';
import clsx from 'clsx';

export function Header() {
  const { id, username } = useSelector(
    (state: RootState) => state.general.userdata
  );
  const openAvatarMenu = useSelector(
    (state: RootState) => state.general.openAvatarMenu
  );
  const dispatch = useDispatch();

  const onClickAvatar = () => {
    dispatch(changeOpenAvatarMenu(!openAvatarMenu));
  };

  const emptyAvatar = (
    <div
      className={clsx(
        'bg-primary-light dark:bg-primary-dark',
        ' w-10.5 h-10.5 rounded-full',
        'border dark:border-white',
        'flex justify-center items-center'
      )}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-7.5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
        />
      </svg>
    </div>
  );

  return (
    <header className="w-full max-w-7xl px-3 py-5 2xs:p-5 flex gap-5 items-center relative">
      <Logo />
      <div className="grow"></div>
      <div
        role="avatar"
        className="cursor-pointer border rounded-full duration-200"
        onClick={onClickAvatar}
        id="avatar">
        {id ? <Avatar title={username} seed={id} /> : emptyAvatar}
      </div>
      {openAvatarMenu && <AvatarMenu />}
    </header>
  );
}
