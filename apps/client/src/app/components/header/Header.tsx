import { useDispatch, useSelector } from 'react-redux';
import Avatar from '../avatar/Avatar';
import { Logo } from './logo/Logo';
import { RootState } from '@/app/store/store';
import { AvatarMenu } from './avatarMenu/AvatarMenu';
import { changeOpenAvatarMenu } from '@/app/store/generalSlice';

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

  return (
    <header className="w-screen max-w-7xl p-5 flex gap-5 items-center relative">
      <Logo />
      <div className="grow"></div>
      <div
        role="avatar"
        className="cursor-pointer border hover:border-hover-light rounded-full duration-200"
        onClick={onClickAvatar}
        id="avatar">
        {id && <Avatar title={username} seed={id} />}
      </div>
      {openAvatarMenu && <AvatarMenu />}
    </header>
  );
}
