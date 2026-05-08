import Avatar from '../avatar/Avatar';
import { Logo } from './logo/Logo';

const onClickAvatar = () => {
  console.log('click avatar');
};

export function Header() {
  return (
    <header className="w-screen max-w-7xl p-5 flex gap-5 items-center">
      <Logo />
      <div className="grow"></div>
      <div
        className="cursor-pointer border hover:border-hover-light rounded-full duration-200"
        onClick={onClickAvatar}>
        <Avatar title="Unknown" seed="Unknown" />
      </div>
    </header>
  );
}
