import { useSelector } from 'react-redux';
import Avatar from '../avatar/Avatar';
import { Logo } from './logo/Logo';
import { RootState } from '@/app/store/store';

const onClickAvatar = () => {
  console.log('click avatar');
};

export function Header() {
  const { id, username } = useSelector(
    (state: RootState) => state.general.userdata
  );
  useSelector((state: RootState) => state.general.userdata);

  return (
    <header className="w-screen max-w-7xl p-5 flex gap-5 items-center">
      <Logo />
      <div className="grow"></div>
      <div
        role="avatar"
        className="cursor-pointer border hover:border-hover-light rounded-full duration-200"
        onClick={onClickAvatar}>
        {id && <Avatar title={username} seed={id} />}
      </div>
    </header>
  );
}
